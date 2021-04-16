

# Handling image optimization on any static site

💁 **Intended audience:** _This is meant for developers building "template-driven"  static sites (11ty, Jekyll, Hugo, plain HTML) or "component-driven" web apps (NextJS, Gatsby, etc). If you're working with site builders like Wordpress or Shopify, this probably isn't the article for you!_

If you've been building websites for a while, "optimize your images" probably sounds like "eat your veggies." It's good for your website's health, it'll make your SEO big and strong... but that `.webp` broccoli doesn't sound appetizing to me 🤢

What we need are some "easy wins." Some cheese to melt over that beautifully compressed brussel sprouts. So let's explore:

- 🥦 (Briefly) Why you should care about those pesky 4K images
- 🌅 How image `srcset` and `sizes` properties can change your optimization game
- 🔨 Some helpful packages you can add to your static site generator of choice

*Onwards!*

## 🥦 So what's wrong with my images right now?

Before getting into the tips, let me remind you have just how badly images can hurt the performance of your website. Here's a lighthouse rating from one of my recent blog posts (images compressed with [tinyJPG](https://tinyjpg.com/) mind you!)

![image-opt-bad-lighthouse-score](/Users/benholmes/Repositories/bholmesdev/assets/blog/image-opt-bad-lighthouse-score.png)

Yikes. 10 seconds to grab all those images!? Chromium definitely does some throtting to test on "slower" internet connections, but it's clear those KB rating are quite high (especially for mobile users).

This just to show that **there's much more to image optimization than compression!** There's also:

- **Serving the right format,** with JPGs preferrable and `.webp` or `.avi` *especially* so
- **Serving the right size,** ideally with _multiple copies_ of the same image at different widths and heights
- **Loading at the right time,** reaching for "lazy" loading when we can
- Heck, even **including `alt` text** can affect your site from both accessibility and SEO standpoints! 

I learned a bit about addressing those format and size problems using `picture` elements, and my lighthouse definitely thanked me for it 😄

https://twitter.com/BHolmesDev/status/1378869249930842116

##🌅 Fixing format + size problems with the `picture` element

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

...But this isn't very scalable. What if we're, say, working in a markdown file where we can't append class names? Or we have a few different formats we want to switch between (JPEG vs WEBP for example)?

This is where the `picture` element comes in. Take this example here:

```html
<picture>
  <!-- List out all the WEBP images + WEBP sizes we can choose from -->
  <source type="image/webp" srcset="/assets/fine-boi.jpeg 600w, /assets/mega-chonker.jpg 1000w" sizes="100vw">
  <!-- In case a browser doesn't support WEBP, fall back to this set of JPG sources -->
  <source type="image/jpeg" srcset="/assets/fine-boi.jpeg 600w, /assets/mega-chonker.jpg 1000w" sizes="100vw">
  <!-- The actual, style-able img element that "receives" these sources -->
  <!-- Also includes a default src in case no <source> can be applied -->
  <img src="/assets/fine-boi.png" />
</picture>
```

**Some big takeaways:**

1. We can wrap our image tags in a `picture` to unlock a "switch" case of sorts, loading the first `source` that your browser supports. These days, _most_ modern browsers will reach for those shiny `.webp` files without needing the JPG fallbacks ([current browser support here](https://caniuse.com/?search=webp)).
2. Each source has a **`srcset` property**, which takes in a list of source URLs for a given image format. These sources are comma-separated, plus a pixel-value width using that `w` on the end. By default, the browser will compare the browser width against those `w` values to decide which URL to use.
3. **Picture elements are not images themselves!** This is an interesting gotcha when you start trying to style those images. So, you'll want to keep putting all your image-specific CSS (ex. `object-fit`) on that `img` element instead of the `picture`.

You also may have noticed that `sizes="100vw"` property on the end of each `source`. This is nice default if you _don't_ understand how the `sizes` property works...

But maybe we can address that knowledge gap 😁

### The `sizes` attribute

`Sizes` is an interesting beast, since it's the first HTML attribute I've seen that _almost_ looks like CSS.

Remember those `mobile` and `desktop` helper classes from earlier? Well, `sizes` let us do something rather similar:

