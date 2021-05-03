---
title: Picture perfect image optimization for any web framework
description: Image optimization is never fun to deal with. Let's learn how the picture element + 11ty can save any static site from bloated load times.
layout: blog-post
publishedOn: 2021-03-31T20:01:36.550Z
---

💁 **Intended audience:** _This is meant for developers building "template-driven"  static sites (11ty, Jekyll, Hugo, plain HTML) or "component-driven" web apps (NextJS, Gatsby, etc). If you're working with site builders like Wordpress or Shopify, this probably isn't the article for you!_

If you've been building websites for a while, "optimize your images" probably sounds like "eat your veggies." It's good for your website's health, it'll make your SEO big and strong... but that `.webp` broccoli doesn't sound appetizing to me 🤢

What we need are some "easy wins." Some cheese to melt over that beautifully compressed brussel sprouts. So let's explore:

- 🥦 (Briefly) Why you should care about those pesky 4K images
- 🌅 How the `picture` element can change your optimization game
- 🔨 A helpful 11ty script you can add to your static site generator of choice

*Onwards!*

## 🥦 So what's wrong with my images right now?

Before getting into the tips, let me remind you have just how badly images can hurt the performance of your website. Here's a lighthouse rating from one of my recent blog posts (images compressed with [tinyJPG](https://tinyjpg.com/) mind you!)

![List of poor image loadtimes from Chromium Lighthouse performance report](assets/blog/image-opt-bad-lighthouse-score.png)

_Yikes!_ 10 seconds to grab all those images? Chromium definitely does some throtting to test on "slower" internet connections, but it's clear those KB rating are quite high (especially for mobile users).

This just to show that **there's much more to image optimization than compression!** There's also:

- **Serving the right format,** with JPGs preferrable and `.webp` or `.avi` *especially* so
- **Serving the right size,** ideally with _multiple copies_ of the same image at different widths and heights
- **Loading at the right time,** reaching for "lazy" loading when we can
- Heck, even **including `alt` text** can affect your site from both accessibility and SEO standpoints! 

I learned a bit about addressing those format and size problems using `picture` elements, and my lighthouse definitely thanked me for it 😄

https://twitter.com/BHolmesDev/status/1378869249930842116

## 🌅 Fixing format + size problems with the `picture` element

So how can we deliver different image files for the right people? Well, let's start with a humble image element like this one:

```html
<img src="/assets/mega-chonker.jpg" width="2000" height="1000" alt="Mega chonker" />
```

_Refer to [this handy chart](/assets/blog/heckin-chonker.jpg) for understanding "chonk" levels_

Now, say we've opened our image editor and saved a smaller version of the same file for mobile users sitting at, say, 600x300. You could probably set up some CSS to hot-swap your images depending on your screen width:

```html
<img class="desktop" src="/assets/mega-chonker.jpg" width="2000" height="1000" alt="Mega chonker" />
<img class="mobile" src="/assets/fine-boi.jpg" width="600" height="300" alt="A fine boi" />
```

```css
@media(max-width: 600px) {
  .desktop { display: none; }
}
@media(min-width: 601px) {
  .mobile { display: none }
}
```

...But this isn't very scalable. What if we're, say, working in a markdown file where we can't append class names? Or we have different formats we want to switch between depending on browser support (JPEG vs WEBP for example)?

This is where the `picture` element comes in. Take this example here:

```html
<picture>
  <!-- List out all the WEBP images + WEBP sizes we can choose from -->
  <source type="image/webp" srcset="/assets/fine-boi.jpeg 600w, /assets/mega-chonker.jpg 1000w" sizes="100vw">
  <!-- In case a browser doesn't support WEBP, fall back to this set of JPG sources -->
  <source type="image/jpeg" srcset="/assets/fine-boi.jpeg 600w, /assets/mega-chonker.jpg 1000w" sizes="100vw">
  <!-- The actual, style-able img element that "receives" these sources -->
  <!-- Also includes a default src in case no <source> can be applied -->
  <img src="/assets/fine-boi.png" alt="A perfectly sized cat" />
</picture>
```

**Some big takeaways:**

1. We can wrap our image tags in a `picture` to unlock a "switch" case of sorts, with your browser picking the first `source` that it's able to render. But admittedly, _most_ modern browsers will reach for those shiny `.webp` files without needing the JPG fallbacks ([current browser support here](https://caniuse.com/?search=webp)).
2. Each source has a **`srcset` property**, which takes in a list of source URLs for a given image format. These sources are comma-separated, plus a pixel-value width using that `w` on the end. By default, the browser will compare the browser width against those `w` values to decide which URL to use.*****
3. **Picture elements are not images themselves!** This is an interesting gotcha when you start trying to style those images. So, you'll want to keep putting all your image-specific CSS (ex. `object-fit`) on that `img` element instead of the `picture`.

_* Your screen's pixel density can also affect which image gets picked. For high-density mobile displays or 4k panels, it'll actually choose an image that's **double** the width of the screen! So if you have, say, an image targeted at a `600px` screen width, make sure you have a `1200px` option ready-to-go._

You also may have noticed that `sizes="100vw"` property on the end of each `source`. This is nice default if you _don't_ understand how the `sizes` property works...

But maybe we can address that knowledge gap 😁

### The `sizes` attribute

`Sizes` is an interesting beast. It _almost_ looks like CSS actually, with some small syntax differences.

Remember those `mobile` and `desktop` helper classes from earlier? Well, `sizes` let us do something rather similar. 

{% youtube uGiG2VWkeSs %}

**Key takeaways:**

- you should usually have a "default" (smallest) option sitting at `100vw`, assuming your image takes up all or most of the screen width on smaller devices
- you should choose your widths based on the **size of the image container** at a given screen size. If your image width always matches the screen size, you can probably stick with `100vw` alone
- For extra breakpoints, you place either a `min` or `max` width media query in parens `()`, followed by the image width the use. The browser will match this width with the best image for the job from `srcset` options. **For example,** say our image is the full width of the screen for mobile and tablet displays, but _always_ `720px` wide once we hit a desktop screen width of `1440px`: `sizes="(min-width: 1440px) 720px, 100vw"`
- to reiterate, **high density displays use an image that's _twice_ the width you specify.** So if you have a sizes attribute like this: `sizes="(min-width: 2000px) 720px, 100vw"`, you should have a `1440px` wide image (or something close) for that `720px` option

_**Note:** You may be wondering why browsers can't do all this work for us. Well, this comes down to the unpredictable nature of "width" when you're throwing around CSS everywhere. If you're like me, you tend to use a lot of percentages like `with: 100%` for image blocks, which may adjust depending on the container, padding, margins, etc that get applied. If the browser tried to decipher all this styling before loading an image, you'd be waiting a lot longer than you might want!_ 

## 🔨 Applying this to your site with 11ty image

Alright, so we see how useful the `picture` element can be... but it's only as powerful as the pictures we can supply to it. Do we really want to create all those beautifully resized, optimized, multi-format images _by hand?_

Luckily, there's a lot of tools to handle this process for us, and I'm going to hone in on the simplest I've found: [11ty's image plugin.](https://www.11ty.dev/docs/plugins/image/#output-directory)

🚨 Now before you start scrolling to the next section, **no, you don't need to build your site with 11ty to use this.** Playing around with this tool, I realized it's perfect for generating optimized images on-the-fly for _any_ use case, no command line prowess required 🔥 

### Generating optimized images

{% youtube RAzXB-qu22s %}

Let's play along at home! Seriously, drop everything and go open your code editor 🧑‍💻 Then, make a fresh directory / folder and create a basic `package.json`. We'll be installing the `@11ty/eleventy-img` dependency:

```bash
mkdir woah-11ty-image-is-cool && cd woah-11ty-image-is-cool
npm init -y # Make a package.json with defaults for everything
npm i @11ty/eleventy-img
```

Now make a random JavaScript file for us to play with (I'll call mine `image-generator.js`). Inside, just paste the example code at the top of [11ty's documentation](https://www.11ty.dev/docs/plugins/image/#output-directory):

```js
const Image = require("@11ty/eleventy-img");

(async () => {
  let url = "https://images.unsplash.com/photo-1608178398319-48f814d0750c";
  let stats = await Image(url, {
    widths: [300]
  });

  console.log(stats);
})();
```

Hm, this looks pretty straightforward. Let's run it from our terminal and see what happens:

```bash
node ./image-generator.js
```

With any luck, you should see a couple new faces appear:

- **A `/img` directory** with 2 images inside: 1 JPG picture of a galaxy that's 300 pixels wide, and a matching `webp` image of the same size. Notice how this matches up with our `widths` array from the code snippet 👀
- **A `/cache` directory** with some strings of characters. Think of this like a note-to-self for the plugin about the image we downloaded. It's expensive to download images off the internet, so to avoid loading it _every time we run the script,_ 11ty checks the cache to see if we've already loaded the image in the past 👍

You'll also see a [blob of "stats"](https://www.11ty.dev/docs/plugins/image/#usage) logged to your console. Most of these properties are self-explanatory, and some should look familiar from our `picture` walkthrough earlier on (namely the `sourceType` and `srcset` attributes). We even get the output `size` of the image in bytes, in case you want to inspect the differences between formats and sizes.

But wait, there's more! Let's try experimenting with different widths and formats:

```js
...
let stats = await Image(url, {
  widths: [300, 1000, 1400],
  formats: ['jpg', 'webp', 'gif']
});
...
```

We should get a plethora of resolutions inside that `img` directory. As you can imagine, this is perfect for our picture element from earlier. You can whip up all the `source`s and `size` attributes by hand as a learning exercise...

### Automating our picture elements
...Or let the plugin do this for us! Along with that handy array of `stats`, 11ty image will splice everything into a valid `<picture>` element. All we need is a call to the `generateHTML` helper:

```js
const Image = require("@11ty/eleventy-img");

(async () => {
  let url = "https://images.unsplash.com/photo-1608178398319-48f814d0750c";
  let stats = await Image(url, {
    widths: [300, 1000, 1400]
  });
  const html = Image.generateHTML(stats, {
  	alt: "A blue and purple galaxy of stars", // alt text is required!
	sizes: "100vw" // remember our training with "sizes" from earlier...
  })

  console.log(html);
})();
```

With any luck, we should see a beautiful `picture` we can use anywhere on our site:

```html
<picture>
	<source type="image/webp" srcset="/img/6dfd7ac6-300.webp 300w, /img/6dfd7ac6-1000.webp 1000w, /img/6dfd7ac6-1400.webp 1400w" sizes="100vw">
	<source type="image/jpeg" srcset="/img/6dfd7ac6-300.jpeg 300w, /img/6dfd7ac6-1000.jpeg 1000w, /img/6dfd7ac6-1400.jpeg 1400w" sizes="100vw">
	<img alt="A blue and purple galaxy of stars" src="/img/6dfd7ac6-300.jpeg" width="1400" height="1402">
</picture>
```

### Going further
This plugin has a whole host of extra options to explore too, like
- [messing with cache options](https://www.11ty.dev/docs/plugins/image/#caching-remote-images-locally-new-in-image-0.3.0) for faster build times
- [generating image stats + picture elements synchronously](https://www.11ty.dev/docs/plugins/image/#synchronous-usage), so you don't have wait for the images to _actually_ get generated
- [fine-tuning the Sharp image processor](https://www.11ty.dev/docs/plugins/image/#advanced-control-of-sharp-image-processor) to tweak the output to your needs

## 📣 Using 11ty image with any framework
If all this `<picture>` madness excites you, go throw this 11ty image plugin at your own `/assets` directory! I wrote this handy little script to crawl all the images in a directory ([not recursively mind you](https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js)) and spit out some optimized files:

```js
const Image = require('@11ty/eleventy-img')
const { readdir } = require('fs/promises') // node helper for reading folders
const { parse } = require('path') // node helper for grabbing file names

;(async () => {
  const imageDir = './images' // match this to your assets directory
  const files = await readdir(imageDir)
  for (const file of files) {
    const stats = await Image(imageDir + '/' + file, {
      widths: [600, 1000, 1400], // edit to your heart's content
      filenameFormat: (id, src, width, format) => {
        // make the filename something we can recognize.
        // In this case, it's just:
        // [original file name] - [image width] . [file format]
        return `${parse(file).name}-${width}.${format}`
      },
    })
    console.log(stats) // remove this if you don't want the logs
  }
})()
```

If you _happen_ to use 11ty on your personal site (or at least want to try), you can automate the `picture` element insertion as well. [Their guide](https://www.11ty.dev/docs/plugins/image/#use-this-in-your-templates) covers building your own "shortcode" function to insert the right `picture` for every unoptimized image on your site.

Even without this luxury though, this script is a great addition to any JS-based build step. Here's a basic `Image` component I could slap into any React app based on that script above:

```jsx
// consider using TypeScript for checking all these props!
const Image = ({ fileName, sizes, ...imageProps }) => (
	<picture>
	  <source
		type="image/webp"
		srcSet={`/img/${fileName}-600.webp 600w, /img/${fileName}-1000.webp 1000w, /img/${fileName}-1400.webp 1400w`}
		sizes={sizes}
	  />
	  <source
		type="image/jpeg"
		srcSet={`/img/${fileName}-600.jpeg 600w, /img/${fileName}-1000.jpeg 1000w, /img/${fileName}-1400.jpeg 1400w`}
		sizes={sizes}
	  />
	  <img src={`/img/${fileName}-600.jpeg`} {...imageProps} />
	</picture>
)
```

Assuming all my images get generated with this file naming convention (and I always have images at 600, 1000, and 1400 widths), this should pull all our optimized images no problem 👍

### Other options for Next, Nuxt, Gatsby and more

As cool as 11ty image can be, I should definitely highlight some "native" options for popular meta-frameworks: 
- **For Next, [their built-in Image component](https://nextjs.org/docs/api-reference/next/image) is perfect.** They'll also cover our sizes, formats, and image compression automatically, plus some neat props for eagerly loading images that are "above the fold" using `priority`.
- **For Nuxt, [their `<nuxt-img>` and `<nuxt-picture>` components](https://image.nuxtjs.org/components/nuxt-img/) should have you covered.** These offer most of the same benefits as our 11ty image plugin, letting you specify different formats, a `sizes` attribute, and background image compression. Just be sure to use `nuxt-picture` if you want to allow multiple image formats instead of just one!
- **For Gatsby, [you've got the gold standard of image optimization](https://www.gatsbyjs.com/plugins/gatsby-plugin-image) 🏆** Their image plugin was actually my main reason for using the framework a few years back, and it's only gotten better. The nicest feature (beyond matching everything we've talked about) is their loading animations for images. You can fade in over vector traces of an image, use a blur effect, and a lot more. The only downside is the hefty JS bundle it loads into the browser to pull this off, which I've [given my opinions on over here](https://bholmes.dev/blog/before-building-your-next-static-site-with-react-consider-this/).
- **Beyond the framework, you can [optimize remotely using something like Cloudinary](https://davidwalsh.name/image-optimization-cloudinary).** This is a great option if you don't own the build process for your website, or don't want to store your images inside your code repository. For example, you can point all your Wordpress images to a cloudinary bucket and pull different image widths and formats for there. The only downside is the cost, since Cloudinary is doing all this image processing and storage for you.