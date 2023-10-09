import { writable, derived } from "svelte/store";


export const scroll = writable({
    scrollY: 0,
    articleHeight: 1,
    viewportHeight: 1,
})

export const progress = derived(
    scroll,
    ($scroll) => Math.min(($scroll.scrollY + $scroll.viewportHeight) / $scroll.articleHeight, 1),
)
