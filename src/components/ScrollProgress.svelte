<script lang="ts">
    import { scroll } from "./scroll.store";

    let scrollY = 0;
    let viewportHeight = 0;
    let article: HTMLDivElement;

    $: articleHeight = article ? article.offsetTop + article.offsetHeight : 0;
    $: scroll.set({ scrollY, articleHeight, viewportHeight })
</script>

<svelte:window bind:scrollY bind:outerHeight={viewportHeight} />
<div bind:this={article}>
    <slot />
</div>
