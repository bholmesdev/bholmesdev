import { defineAction, z } from "astro:actions";
import { experimental_AstroContainer } from "astro/container";

const components = import.meta.glob("/src/components/*");
// console.log(components);

export const render = {
  proxy: defineAction({
    input: z.object({
      path: z.string().refine((p) => p in components),
      props: z.record(z.any()),
      export: z.string().optional(),
    }),
    handler: async ({ path, props, export: exp }, ctx) => {
      const url = new URL("/component", ctx.request.url);
      url.searchParams.set("path", path);
      url.searchParams.set("props", JSON.stringify(props));
      if (exp) url.searchParams.set("export", exp);
      const res = await fetch(url);

      return await res.text();
    },
  }),
  component: defineAction({
    input: z.object({
      // TODO: check by glob() result on components/
      path: z.string().refine((p) => p in components),
      props: z.record(z.any()),
    }),
    handler: async ({ path, props }, ctx) => {
      console.log("starting");
      const container = await experimental_AstroContainer.create({
        renderers: [
          {
            name: "@astrojs/react",
            clientEntrypoint:
              "/Users/benholmes/Repositories/bholmesdev/node_modules/@astrojs/react/client.js",
            serverEntrypoint:
              "/Users/benholmes/Repositories/bholmesdev/node_modules/@astrojs/react/server.js",
          },
        ],
      });
      const component = await components[path]?.();

      const meta = component.default;

      const factory = (result, _, slots) => meta(result, props, slots);
      Object.assign(factory, meta);
      console.log("component", component);

      return container.renderToString(factory, {
        request: ctx.request,
        locals: ctx.locals,
      });
    },
  }),
};
