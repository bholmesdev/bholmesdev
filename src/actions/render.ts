import { defineAction, z } from "astro:actions";
import { experimental_AstroContainer } from "astro/container";

const components = import.meta.glob("/src/components/*");
console.log(components);

export const render = {
  component: defineAction({
    input: z.object({
      // TODO: check by glob() result on components/
      path: z.string().refine((p) => p in components),
      props: z.record(z.any()),
    }),
    handler: async ({ path, props }, ctx) => {
      const container = await experimental_AstroContainer.create({
        streaming: true,
        // TODO
        renderers: [],
      });

      const component = await components[path]?.();
      console.log(component);

      const meta = component.default;

      const factory = (result, _, slots) => meta(result, props, slots);
      Object.assign(factory, meta);

      return container.renderToString(factory, {
        request: ctx.request,
        locals: ctx.locals,
      });
    },
  }),
};
