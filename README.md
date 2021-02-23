<h1 align="center">Welcome to Ben Holmes' personal site 👋</h1>
<p>
  <a href="https://app.netlify.com/sites/bholmes/deploys" target="_blank">
    <img src="https://api.netlify.com/api/v1/badges/83df5f20-4455-4cc9-9854-8136876a3b82/deploy-status" alt="Netlify Status" />
  </a>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href="https://twitter.com/bholmesdev" target="_blank">
    <img alt="Twitter: bholmesdev" src="https://img.shields.io/twitter/follow/bholmesdev.svg?style=social" />
  </a>
</p>
<img style="max-width: 600px" src="assets/og-images/me.jpg" alt="Charcoal self portrait with side text: teacher, blogger, UX freak, fan of charcoal">

> A statically generated, JAMStack-ified SPA using a custom build tool + 11ty 🚀

✨ [Explore the live site](https://bholmes.dev)

## Table of Contents <!-- omit in toc -->

- [🏃‍♂️ Running this thing locally](#️-running-this-thing-locally)
- [🏆 Goals of this project](#-goals-of-this-project)
- [💪 Leaning on 11ty](#-leaning-on-11ty)
- [🗂 General file structure](#-general-file-structure)
- [🔖 The concept of `[data-page]`](#-the-concept-of-data-page)
  - [Layout chaining](#layout-chaining)
- [💨 Page transitions](#-page-transitions)
  - [Layout diffing](#layout-diffing)
- [💅 `.scss` style scoping](#-scss-style-scoping)
  - [Layout style scoping](#layout-style-scoping)
- [⚙️ `.mjs` scripts](#️-mjs-scripts)
  - [Scripts on layouts](#scripts-on-layouts)
  - [The `_main.mjs` file](#the-_mainmjs-file)
- [🤝 Show your support](#-show-your-support)
- [✍ Author](#-author)

## 🏃‍♂️ Running this thing locally


Make sure you have NodeJS installed first. Then, run this terminal command inside the project directory:

```sh
npm i
npm start
```

This will spin up a local development server using [Browsersync](https://browsersync.io/) with live reloading on file changes.

You should also notice a softly thrown exception in your console. This is totally normal! Since blog posts previewed on the homepage are pulled from [DEV](https://dev.to), you'll need an environment variable to render them properly. You can check out [DEV's API docs](https://docs.dev.to/api/#operation/getUserPublishedArticles) to pull from your personal account and see what happens 😁

## 🏆 Goals of this project

Well, this certainly ain't your grandma's [Gatsby](https://www.gatsbyjs.com) site! This thing is lightweight, framework-free, and full of custom configuration. I built this project with a few goals in mind:
1. **I did _not_ want to lean on existing frameworks** to make it work, mostly as a learning exercise. So no React, Vue, Svelte, or even JQuery to be found.
2. **I wanted a single page app feel** with sexy page transitions to boot ✨ This was not easy to pull off given the first goal, but not impossible!
3. **I wanted to stay on the bleeding edge** of modern browser APIs. So [dynamic JS imports](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import), [ES modules](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules), [CSS grid](https://css-tricks.com/snippets/css/complete-guide-grid/)... it's all fair game.
4. And lastly, **I have the need for speed** 🚀 Pages (and transitions between those pages) needed to stay crisp, and load times for styles, scripts, and assets should stay low. [Preloading](https://developer.mozilla.org/en-US/docs/Web/HTML/Preloading_content) is the name of the game here.

## 💪 Leaning on 11ty

My first iteration on this portfolio concept didn't use any existing frameworks at all. There were custom solutions for data fetching at build time, layout rendering, JS bundling... well, I reinvented every wheel in existence. This had a nasty consequence: every time I revisited the repo to tweak something, I needed to re-read my own docs to remember how it fit together 😬

In the end, it's clear that [11ty](https://www.11ty.dev) can save me from this chaos. It has some nice out-of-the-box features that I can piggyback off of:
- [Data fetching at buildtime](https://www.11ty.dev/docs/data-template-dir/) using `.11ydata.js` files
- [Global data](https://www.11ty.dev/docs/data-global/) available to _all_ my templates from a `_data` folder
- [Hot reloading](https://www.11ty.dev/docs/usage/#re-run-eleventy-when-you-save) during development using browsersync
- Support for [fancy HTML transforms](https://www.11ty.dev/docs/config/#transforms)

From this baseline, I set up a new system for layouts, styles, and JS that works nicely with their (experimental!) `addExtension` helper. You can check out that configuration [in the .eleventy.js file](/.eleventy.js) if you're so inclined, but that's beyond the scope of this README 😁
## 🗂 General file structure

Here's a breakdown of the folder hierarchy + naming conventions:

```bash
build # Build output from src
assets # Dump for images, fonts, and icons
src # The fun zone 🚀
  _data # 🗄 Data globally available to all pages
  _layouts # 🗂 Templates, styles, and scripts *wrapping around* pages
  _includes # 🎒 Templates and SVG graphics *imported into* pages
  _main.mjs # 🧵 A magical file that makes the whole app work
  [route-name].* # Templates, styles, and scripts for *actual routes* on the site
utils # Helper JS functions used server and clientside
```

You'll also notice a general rhythm for all the `route-name` files: there's a `.pug` file, a `scss` file, and an `mjs` file of the same name.

This is how I "group" all my logic together by route. For instance, `contact.scss` applies styles to the `/contact` page, and `contact.mjs` runs some JavaScript whenever the `/contact` page loads. We'll explore how this works in the following sections!

## 🔖 The concept of `[data-page]`

To understand how this system ties together, I'll need to explain one magical attribute: `[data-page]`.

In short, this is an identifier I use to figure out how all my [layout chains](https://www.11ty.dev/docs/layout-chaining/) fit together. This lets me pull off animated page transitions, style scoping, JS scoping, and more!

Here's a simple example. Say I'm writing a post in `cool-blog-post.md` with a template like this:

```md
---
layout: blog-post
---

# Very cool post!

With text and such.
```

Then, maybe I'll have a `_layouts/blog-post.pug` file that looks like this (pardon the [pug](https://pugjs.org/api/getting-started.html) syntax!):

```pug
html
  body
    nav
      a(href="/") Home

    main(data-page=slinkit.page)
    | !{content}
```

☝️ Here we find our first `data-page` property. This should get applied to the container _immediately_ outside of the `content` (aka our `cool-blog-post`). The actual value gets applied by that `slinkit.page` property, which my build tool passes in for you.

When this page gets built, we'll end up with a file that looks like this:

```html
<html>
  <body>
    <nav>
      <a href="/">Home</a>
    </nav>
    <main data-page="very-cool-post">
      <h1>Very cool post!</h1>
      <p>With text and such.</p>
    </main>
  </body>
</html>
```

Pretty much what you'd expect! And as you can see, that `data-page` value is taken straight from the name of the file inside. 

This brings us to what this property really is: **the value of `data-page` identifies whatever you're putting inside a given layout.**

### Layout chaining

This remains true for [layouts-within-layouts](https://www.11ty.dev/docs/layout-chaining/) as well. Say we have a hierarchy like this:

```
_layouts/
  index.pug
  blog-navigation.pug
  blog-post.pug

very-cool-post.md
```

Where `very-cool-post` uses the `blog-post` layout, which uses the `blog-navigation` layout, which uses the `index` layout.

When we snap all these nested layouts together, we might get something like this:

```html
<!--index layout starts at the outermost level -->
<html lang="en-US">
  <head>...</head>
  <body data-page="_layouts/blog-navigation">
    <!--blog-navigation layout starts here -->
    <aside>
      <h2>Neat table of contents</h2>
      <a href="#1">Section 1</a>
      <a href="#2">Section 2</a>
      <a href="#3">Section 3</a>
    </aside>
    <main data-page="_layouts/blog-post">
      <!--blog-post layout starts here -->
      <img src="thumbnail.jpg" alt="...">
      <section data-page="very-cool-post">
        <!--very-cool-post starts here -->
        <h1>Very cool post!</h1>
        <p>With text and such.</p>
      </section>
    </main>
  </body>
</html>
```

You can think of this like **fitting a bunch of lego bricks together**, where `data-page` attributes are those little teeth that hold the bricks together 🧱

## 💨 Page transitions

This feature is one of the main reasons for my "[Single Page App](https://huspi.com/blog-open/definitive-guide-to-spa-why-do-we-need-single-page-applications)" setup. Since I'm not reloading the browser to load a new page, I can apply whatever page transitions I want while loading new content.

As it stands, there's only one page transition across the site: sliding in from the bottom of the screen. 

![Page transitions clicking between home and contact pages](/readme-assets/page-transitions.gif)

But as you can see, I _only_ animate in the new page, while the navigation bar stays put. How can I pull this off if I'm not using React or something similar?

Well, it all comes down to the `[data-page]` property. Let's say we're animating between two pages **that both use the same layout.** The `/build` output for these pages might look like this:

```html
<!--about.html-->
<html lang="en-US">
  <head>...</head>
  <body>
    <nav>
      <a href="/about">About Me</a>
      <a href="/contact">Get in touch</a>
    </nav>
    <main data-page="about">
      <h1>All about me</h1>
      <p>I got a lot to say lemme tell ya...</p>
    </main>
  </body>
</html>

<!--contact.html-->
<html lang="en-US">
  <head>...</head>
  <body>
    <nav>
      <a href="/about">About Me</a>
      <a href="/contact">Get in touch</a>
    </nav>
    <main data-page="contact">
      <h1>Get in touch</h1>
      <p>Fill out this shiny form!</p>
      <form>...</form>
    </main>
  </body>
</html>
```

These pages are obviously identical until we hit that `main` tag. Inside here, we have some new content to animate into view.

We _could_ walk through the page element-by-element to figure out "what's changed" (similar to how the [virtual DOM](https://reactjs.org/docs/faq-internals.html) works in React). But with our `data-page` attributes hooking our layouts together, there's no need for all that work!

You can explore the layout diff-ing function in the following section, but the major takeaway: **💡 page transitions will only animate the pieces that change, and ignore the pieces that don't** (as far as layouts are concerned anyways).

### Layout diffing

[Source code here](/utils/client/get-page-diff.js)

Here's the multi-step process I use to find what's changed:

1. **Download the next page we're animating to** using a `fetch` call. This is as simple as calling `fetch("/about")` from JavaScript, and grabbing the output as a big string of HTML.
2. **Find all the `[data-page]` elements** in both a) our current page and b) the page we just downloaded. Just querying `page.querySelectorAll('[data-page]')`, we'll get all those elements in order from outermost element to innermost. 
3. Walk through the `[data-page]` elements, **and find the first place where they differ.** This lets us ignore all the nested layouts that are shared between pages.
4. **Animate between those differing elements** 🎉

So if we had two pages with layout chains like this:

```
index                     index
blog-navigation           blog-navigation
blog-post                 personal-notes
very-cool-post.md         very-cool-note.md
```

We'd walk through the nested layouts of each, top to bottom:
- **`index` vs `index`** ✅ Those look the same
- **`blog-navigation` vs `blog-navigation`** ✅ Those too
- **`blog-post` vs `personal-notes`** ✋ Oop, those are different!

So, we'd grab the element with `data-page="personal-notes"`, and animate it over the `data-page="blog-post"` container on our current page.

## 💅 `.scss` style scoping

Any files ending in `.scss` are treated as **scoped styles** for a given route. No, this isn't achieved with gibberish `class` hashes like [CSS Modules](https://github.com/css-modules/css-modules) or [Styled Components](https://styled-components.com)! It's much simpler than this 😁

For example, if we create some styles like this:

```scss
/* about-me.scss */
main {
  background: black;
  color: white;
}

p {
  font-family: 'Comic Sans MS';
}
```

It'll output a CSS file that looks like this:

```css
[data-page="about-me"] main {
  background: black;
  color: white;
}

[data-page="about-me"] p {
  font-family: 'Comic Sans MS';
}
```

And that's it! Since our template layouts apply these `data-page` attributes already, we just use those to scope magically scope our styles.

### Layout style scoping

The process is super similar for layouts. For instance, say we wanted to apply some custom styles to all our blog posts using a `blog-post` layout:

```scss
/* _layouts/blog-post.scss */
p {
  font-family: 'Papyrus';
}

code {
  font-family: 'Fira Code';

  span.line-highlighter {
    background: orange;
  }
}
```

This generates a similar output to our route-based styles:

```css
[data-page="_layouts/blog-post"] p {
  font-family: 'Papyrus';
}

[data-page="_layouts/blog-post"] code {
  font-family: 'Fira Code';
}

[data-page="_layouts/blog-post"] code span.line-highlighter {
  background: orange;
}
```

**💡 Note:** This _doesn't_ scope your styles to the layout template alone! Expect these styles to "cascade" to **the page using this layout** as well.

This setup is super helpful for debugging your CSS. For instance, say I want to figure out why my fonts are getting overridden on one of my blog posts. Popping open the "styles" tab in my inpsector...

![Computed styles in dev tools, showing "blog" styles overriding "_layouts/blog-post" styles](/readme-assets/computed-scoped-styles.png)

...I immediately know where all my styles are coming from! To fix my problem, I just need to remove that beautiful font family from my `blog.scss` file 👍
## ⚙️ `.mjs` scripts

Any files ending in `mjs` are **client-side scripts** the run whenever a given route is loaded. Here's a simple example:

```js
// about-me.mjs
export default () => {
  // JS that runs on page load, once the page transition finishes
  const onClick = () => console.log('I clicked on something!')
  document.addEventListener('click', onClick)

  return () => {
    // "cleanup" code that runs just before transitioning to the next page
    document.removeEventListener('click', onClick)
  }
}
```

Unpacking this a bit:
1. Whenever you visit the `/about-me` page, we run the `default` export function you created _once that page has animated into view._ So, once the page is fully on screen, we'll add the `click` event listener as shown here.
2. We'll run the "cleanup" function returned by this function _just before loading + transitioning to the next page._ Detaching event listeners is a necessary evil! Since we're using clientside routing for everything (aka we never refresh the browser window), the only way to remove these listeners is through manual cleanup like this.

**Note:** You may notice that none of this code can run _during_ a page transition. This is to keep framerates silky smooth during animations. In the future, page transitions could be configurable enough to run whatever JS you choose!

### Scripts on layouts

This works how you might expect! If you want to run some JS on any page using a given layout... just add a `.mjs` file with the same layout name:

```bash
_layouts
  blog-post.pug # Template
  blog-post.mjs # Scoped JavaScript
```

⚠️ There's just one caveat: even if the next page uses the same layout, **the layout script will clean up and re-run from scratch.**

Right now, there's no way to run a client script _only once_ if that layout is used across pages. Open to suggestions on how this could work!

### The `_main.mjs` file

[Source code here](/src/_main.mjs)

In short, this is the puppetmaster that makes everything possible. This script gets applied to all pages of the site, and manages some important functionality:
1. **It listens for link clicks across the site** and prevents the "default" browser behavior (i.e. instead of refreshing the page, we want to animate the next page into view)
2. **It fetches the HTML for the next page.** This is pulled off with a plane ole `fetch` call for the route you're visiting.
3. **It animates whatever content that's changed.** Visit the layout diffing section to understand this process.
4. **It figures out which `.mjs` scripts to run** for a given route. For instance, say we were visiting `/about` which has both an `about.mjs` _and_ a layout with its own `.mjs` file. For this, we'll need to import both of those and execute them after the page transition.
5. **It throws any new styles into the document `<head>`.** In order for our fancy scoped styles to load, we need to fetch that stylesheet and apply it.

...In other words, it does everything I've described in the previous sections 😁

## 🤝 Show your support

Give a ⭐️ if this project helped you!

This project is still pretty in-flux, so I won't be opening issues for newcomers just yet. Still, if any of my current issues peak your interest or you want to talk shop, feel free to [DM me on Twitter](https://twitter.com/bholmesdev) or use [the contact form on this very site!](https://bholmes.dev/contact)

## ✍ Author

👤 **Ben Holmes**

* Twitter: [@bholmesdev](https://twitter.com/bholmesdev)
* Github: [@Holben888](https://github.com/Holben888)
* LinkedIn: [@bholmesdev](https://linkedin.com/in/bholmesdev)

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_