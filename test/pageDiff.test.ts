import { describe, expect, it } from "vitest";
import { getPageDiff } from "../src/router/utils";
import { toHtmlDocument } from "./utils";

describe('page diff', () => {
  it('returns page body when data-page attribute is missing', () => {
    const page1 = toHtmlDocument(`<p>Text</p>`)
    const page2 = toHtmlDocument(`<p>More text</p>`)

    expect(getPageDiff(page1, page2)).toEqual([page1.body, page2.body])
  })

  it('handles pages with top-level shared layout', () => {
    const page1 = toHtmlDocument(`<main data-page="file://layout1.astro"><p>Text</p></main>`)
    const page2 = toHtmlDocument(`<main data-page="file://layout1.astro"><p>Text</p></main>`)

    const page1LayoutContent = page1.querySelector('[data-page="file://layout1.astro"]')
    const page2LayoutContent = page2.querySelector('[data-page="file://layout1.astro"]')

    expect(getPageDiff(page1, page2)).toEqual([page1LayoutContent, page2LayoutContent])
  })

    it('handles pages with top-level layout mismatch', () => {
    const page1 = toHtmlDocument(`
    <main data-page="file://layout1.astro">
      <p>Layout 1</p>
    </main>`)
    const page2 = toHtmlDocument(`
    <main data-page="file://layout2.astro">
      <p>Layout 2</p>
    </main>`)

    expect(getPageDiff(page1, page2)).toEqual([page1.body, page2.body])
  })

  it('handles pages with nested shared layouts', () => {
    const page1 = toHtmlDocument(`
    <main data-page="file://baseLayout.astro">
      <h1>My blog</h1>
      <article data-page="file://blogLayout.astro">
        <p>Text</p>
      </article>
    </main>`)
    const page2 = toHtmlDocument(`
    <main data-page="file://baseLayout.astro">
      <h1>My blog</h1>
      <article data-page="file://blogLayout.astro">
        <p>More text</p>
      </article>
    </main>`)

    const page1LayoutContent = page1.querySelector('[data-page="file://blogLayout.astro"]')
    const page2LayoutContent = page2.querySelector('[data-page="file://blogLayout.astro"]')

    expect(getPageDiff(page1, page2)).toEqual([page1LayoutContent, page2LayoutContent])
  })

  it('handles pages with different number of nested layouts', () => {
    const page1 = toHtmlDocument(`
    <main data-page="file://baseLayout.astro">
      <h1>My homepage</h1>
      <p>Welcome!</p>
    </main>`)
    const page2 = toHtmlDocument(`
    <main data-page="file://baseLayout.astro">
      <h1>My blog</h1>
      <article data-page="file://blogLayout.astro">
        <p>More text</p>
      </article>
    </main>`)

    const page1LayoutContent = page1.querySelector('[data-page="file://baseLayout.astro"]')
    const page2LayoutContent = page2.querySelector('[data-page="file://baseLayout.astro"]')

    expect(getPageDiff(page1, page2)).toEqual([page1LayoutContent, page2LayoutContent])
  })

  it('handles pages with nested layout mismatch', () => {
    const page1 = toHtmlDocument(`
    <main data-page="file://baseLayout.astro">
      <h1>My homepage</h1>
      <article data-page="file://blogLayout.astro">
        <p>More text</p>
        <div data-page="file://dynamicPost.astro">
          <p>MDX here</p>
        </div>
      </article>
    </main>`)
    const page2 = toHtmlDocument(`
    <main data-page="file://baseLayout.astro">
      <h1>My blog</h1>
      <article data-page="file://blogLayout.astro">
        <p>More text</p>
        <div data-page="file://staticPost.astro">
          <p>Static MD here</p>
        </div>
      </article>
    </main>`)

    const page1LayoutContent = page1.querySelector('[data-page="file://blogLayout.astro"]')
    const page2LayoutContent = page2.querySelector('[data-page="file://blogLayout.astro"]')

    expect(getPageDiff(page1, page2)).toEqual([page1LayoutContent, page2LayoutContent])
  })
})