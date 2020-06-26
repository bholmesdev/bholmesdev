<h1 align="center">Welcome to Ben Holmes' personal site 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/bholmesdev" target="_blank">
    <img alt="Twitter: bholmesdev" src="https://img.shields.io/twitter/follow/bholmesdev.svg?style=social" />
  </a>
</p>


> A statically generated, JAMStack-ified SPA using a custom build tool + Pug templates 🚀

### ✨ [Explore the live site](https://bholmes.dev)

## Getting started

### Install dependencies

```sh
yarn install
```

### Spin up the dev server

```sh
yarn start
```

This will spin up a local development server (using [Vercel's serve](https://github.com/vercel/serve)) with live reloading for file changes. You may notice a softly thrown exception in your console. This is totally normal! Since blog posts previewed on the homepage are pulled from [DEV](https://dev.to), you'll need an environment variable to render them properly. If you're interested, you can check out [DEV's API docs](https://docs.dev.to/api/#operation/getUserPublishedArticles) to pull from your personal account 😁

### Build for production

```sh
yarn build
```

This should create a `bundle.js`, `styles.css`, and some static HTML files in the `/public` directory, without creating the dev server.



## So how does this static site work?

This certainly ain't your grandma's Gatsby site! Rather than using component libraries or UI frameworks, this project just uses a from-scratch NodeJS build tool with some framework-y expectations + [Pug](https://pugjs.org) templating. This is meant to keep the project **lean** (`node_modules` come in at under 30 MB!) and **future-proof** (since I basically own the framework).

To understand how it all works, let's focus on some of the main directories and files.

## `src/routes`

This is the bread and butter of the site. Similar to [NextJS](https://nextjs.org) and friends, each directory represents a route on the generated site. Inside each route, you'll find:

1. **Either an `index.js` or `index.pug`**: These act as the entrypoint for a given route, allowing you to complete any server-side processes you want in order to generate the page. If you have some server magic you need to run (i.e. fetch from an API, process some markdown files, etc.), you'll create an `index.js` file that returns HTML as a string. In my case, I simply create a `page.pug` that accepts to some template parameters, and render inside the `index.js` file. If you don't have any serverside code to run, you can just make an `index.pug` for the build tool to pick up and render.

2. **`client.js`**: This is where all your clientside JS will live. Since we're not using any component-based libraries here, this will be all your vanilla DOM manipulation to modify the route's HTML in the browser. Since this project uses clientside routing, you'll also need to consider any cleanup that should run when navigating to a new page (i.e. removing event listeners, killing intersection observers, etc.). This is super easy to handle! Just make sure your file has the following structure:

   ```js
   export default () => {
     /* all your clientside code */
     
     return () => {
       /* all your cleanup code */
     }
   }
   ```

3. **`styles.scss`**: All your, well, styles for the given route. As it stands, the build tool picks up any files with the `.scss` extension in your route directories and bundles them up. So, you're free free to create as many `.scss` files you want with any filename of your choosing! Also note that these styles are not scoped to a particular route by default. To handle this, you can wrap all your styles with a data attribute representing the current route like so:

   ```scss
   /* src/routes/work/styles.scss */
   [data-route='work'] {
     /* scoped styles */
   }
   ```

   The `data-route` attribute should correspond with the route's directory name, unless you override this name in the `routes.js` file (explained below).

## `routes/routes.js`

This is where all routes are detailed for the build tool to pick up. As it stands, this is an array of objects with the following structure:

```js
[...
  {
    routeName: 'index', // the name of the static HTML file / route to create
    routeDirName: 'me', // the route's directory name (only provide this if the dir name differs from the intended route name)
    meta: { // page meta info
      title: 'Ben Holmes' // the page's title attribute
      description: 'Web dev, UX freak, teacher and restless tinkerer' // the page description picked up on social media cards
      imageSrc: '/static/og-images/me.jpg' // relative path to the page thumbnail picked up on social media cards
    }
  }
]
```

Note that each route directory **must have a corresponding `routes.js` entry**. Otherwise, the build tool will skip over the directory entirely. This enforces meta information on each route for better page accessibility / shareability 😁

## `routes/_layout`

This is where all the global logic will live. The file structure is very similar to a traditional route, but the `index.js` works a bit different to accept each route as a parameter.

**As it stands, the render function exported by `index.js` accepts the following params:**

- **`routeName`**: The name of the route as specified in the `routes.js` file. This is used to create the `data-route` attribute for style scoping and clientside routing.

- **`meta`**: All the route's meta info as specified in the `routes.js` file. This will get thrown into the document `<head>` as specified in the `layout.pug` file.

- **`pages`**: The rest of the routes on the site, passed down as a list of HTML strings. This is due to the current routing system in place, which slaps _every page_ onto the current route so they can be shown and hidden using HTML's `hidden` attribute. This means that all HTML on the site is ready to go for crazy-fast page transitions. However, as the site scales to include nested routes and even a blog, this system will probably need to change.



**It's also worth highlighting the `client.js` file**, which handles all of the clientside routing on the site. This file does some fancy things:

- **It listens for all `<a>` tag clicks to handle clientside routing for relative URLs.** If it notices you're trying to visit a site with the current base URL (aka bholmes.dev/something), it will override the default behavior and trigger a page transition using JS. This also means that routing with continue to work when you have JS disabled in your browser! It simply offers a cleaner experience for those that do have JS enabled by overriding serverside routing.
- **It animates between pages based on the `data-route` attribute.** After analyzing the URL you're trying to visit, the script will map this URL to a corresponding `data-route`, and animate in the page with that particular attribute. Once the transition is finished, the previous page will be given the `hidden` attribute so the browser will ignore all the HTML inside that route.
- **It runs a given route's cleanup function before transitioning to the next page.** This is the function returned from a given route's `client.js` handler (explained in the `src/routes` section above).

## `build.js`

This is the _big bad script_ that actually creates the static site. In order to speed up the build, this script runs three async processes in parallel:

### `bundleHTML()`

This will look for all the route directories registered in `routes.js` and decide how to render each page. If it finds an `index.js` file, it will run the exported function and throw the outputted HTML string into the layout. If it only finds an `index.pug` file, it will quickly run `pug.render(PATH_TO_INDEX_PUG)` and do the same thing. At the end, it will create a static `route_name.html` file for each page route. Nested routing will be supported soon!

### `bundleCSS()`

This will crawl through the route directories registered in `routes.js` and the bundle the `.scss` files that it finds (regardless of file name). As described in the `/routes` section, you'll need to wrap your styles with a `data-route` attribute to scope them to a given route.

### `bundlesJS()`

This will collect all clientside JS files into a single bundle using [Rollup](https://rollupjs.org). Right now, it treats `_layout/client.js` as the entry file, where each route's `client.js` must be imported manually. This is far from ideal, since the build tool should be smart enough to detect these `client.js` files and generate the import statements automatically. More on this in a future version!

### Use in the dev server

Since each of these processes can work independently, rebuilding file changes can be _lightning-fast_ in the dev environment ⚡️ For example, if you modify a `.scss` file, the build tool can run  `bundleCSS` alone while ignoring all the JS bundling and Pug rendering. In fact, stylesheet changes can be seen in milliseconds without a visible page refresh!



## Contributing

This project is still pretty in-flux, so I won't be opening issues for newcomers just yet. Still, if any of my current issues peak your interest or you want to talk shop, feel free to [DM me on Twitter](https://twitter.com/bholmesdev) or use [the contact form on this very site!](https://bholmes.dev/contact)



## Author

👤 **Ben Holmes**

* Twitter: [@bholmesdev](https://twitter.com/bholmesdev)
* Github: [@Holben888](https://github.com/Holben888)
* LinkedIn: [@bholmesdev](https://linkedin.com/in/bholmesdev)



## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_