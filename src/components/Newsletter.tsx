import { useActionState } from "react";
import { actions, isInputError } from "astro:actions";
import { experimental_withState as withState } from "@astrojs/react/actions";
import { scope } from "simple:scope";

export function Newsletter() {
  const [state, action, pending] = useActionState(
    withState(actions.subscribeToNewsletter),
    { data: { success: false }, error: undefined }
  );

  const fieldErrors = isInputError(state.error) ? state.error.fields : {};

  return (
    <section className="bg-gray-900 -mx-4 rounded-2xl shadow-xl py-8 px-4 sm:px-8">
      <h2 className="font-bold font-heading text-gray-200 text-2xl mb-2">
        The whiteboardist newsletter
      </h2>
      <p className="mb-8">
        Occasional posts and learnings from a lead Astro maintainer.
      </p>
      <form action={action} className="flex gap-4 items-start">
        <div className="flex flex-col gap-4 w-full">
          <div className="flex gap-4 flex-wrap">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor={scope("email")} className="sr-only">
                {" "}
                Email{" "}
              </label>
              <input
                id={scope("email")}
                name="email"
                type="email"
                required
                className="rounded px-4 py-3 border-2 border-slate-700 focus:ring-0 focus:border-primary focus:outline-none transition-colors"
              />
              {fieldErrors.email && (
                <p className="text-red-300">{fieldErrors.email}</p>
              )}
            </div>
            <button
              className="group/subscribe-btn bg-gradient-to-br from-slate-600 to-slate-900 rounded-lg flex items-center justify-center"
              disabled={pending}
              type="submit"
            >
              <span className="relative m-1 w-full -translate-y-[4px] active:translate-y-0 group-disabled/subscribe-btn:translate-y-0 ease-spring-5 duration-500 transition-all bg-gradient-to-br from-slate-800 to-slate-600 px-4 py-2 rounded-md text-gray-100 font-bold group-disabled/subscribe-btn:text-primary-light">
                Subscribe
                <span className="-z-1 group-not-disabled/subscribe-btn:hidden blur-[3px] absolute inset-2 animate-pulse">
                  Subscribe
                </span>
              </span>
            </button>
          </div>
        </div>
      </form>
      {state?.data?.success && (
        <p className="bg-green-200 text-green-900 px-2 py-1 rounded mt-4">
          Thanks! Check your inbox for a confirmation.
        </p>
      )}
      {state?.error?.code === "CONFLICT" && (
        <p className="bg-red-300 text-red-900 rounded px-2 py-1 mt-4">
          Oh, looks like you already subscribed. Check your inbox for a
          confirmation.
        </p>
      )}
      {state?.error?.code && state?.error?.code !== "CONFLICT" && (
        <p className="bg-red-300 text-red-900 rounded px-2 py-1 mt-4">
          Something went wrong adding that email. Please try again.
        </p>
      )}
    </section>
  );
}
