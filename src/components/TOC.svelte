<script lang="ts">
    import type { MarkdownHeading } from "astro";
    import { scope } from "simple:scope";
    import { progress } from "./scroll.store";

    let isOpen = true;

    export let headings: MarkdownHeading[];
</script>

<div class="container">
    <div class:isOpen class="panel">
        <div class="progress-container">
            <progress max="1" value={$progress} />
            <svg
                class="done"
                class:show={$progress >= 1}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 512 512"
                ><path
                    d="M448 71.9c-17.3-13.4-41.5-9.3-54.1 9.1L214 344.2l-99.1-107.3c-14.6-16.6-39.1-17.4-54.7-1.8-15.6 15.5-16.4 41.6-1.7 58.1 0 0 120.4 133.6 137.7 147 17.3 13.4 41.5 9.3 54.1-9.1l206.3-301.7c12.6-18.5 8.7-44.2-8.6-57.5z"
                    fill="white"
                /></svg
            >
        </div>
        <ul id={scope("panel")} role="list">
            {#each headings as h}
                <li><a href={`#${h.slug}`}>{h.text}</a></li>
            {/each}
        </ul>
    </div>
    <button
        aria-expanded={isOpen}
        aria-controls={scope("panel")}
        class:isOpen
        on:click={() => (isOpen = !isOpen)}
        class="button"
    >
        <div class="inner">1</div>
    </button>
</div>

<style>
    .progress-container {
        --done-size: 1.8rem;
        display: flex;
        gap: 1rem;
        position: relative;
        align-items: center;
        justify-content: center;
        height: var(--done-size);
        margin-block-start: 0.2rem;
    }

    .done {
        scale: 0;
        visibility: hidden;
        transition: scale 0.2s, visibility 0.2s;
        border-radius: 100%;
        position: absolute;
        top: 0;
        right: 0;
        background: var(--purple);
        height: var(--done-size);
        width: var(--done-size);
        padding: 0.4rem;
    }
    .done.show {
        scale: 1;
        visibility: visible;
    }

    progress {
        background: transparent;
        border: none; /* Reset for firefox */
        -webkit-appearance: none; /* Reset for WebKit/Blink */
        appearance: none;
        border-radius: 1rem;
        overflow: hidden;
        height: 0.8rem;
        background-color: hsl(var(--purple-hs) 90%);
        margin-inline-end: calc(var(--done-size) / 2 - 0.4rem);
    }

    progress::-moz-progress-bar {
        background-color: var(--purple);
        border-radius: 1rem;
    }
    progress::-webkit-progress-value {
        background-color: var(--purple);
        border-radius: 1rem;
    }
    progress::-webkit-progress-bar {
        background: transparent;
    }

    .container {
        --size: 2em;
        --spring-easing: linear(
            0,
            0.178 3.4%,
            1.025 12.7%,
            1.179,
            1.249 18.6%,
            1.254 20.5%,
            1.233 22.6%,
            1.001 32.9%,
            0.938 39%,
            0.941 43.2%,
            0.999 53.2%,
            1.015 59.1%,
            0.996 79%,
            1.001
        );
    }
    .panel {
        border-radius: 1.2em;
        position: absolute;
        min-width: 10em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0.4rem;
        box-shadow: var(--shadow-5);
        border: 3px solid var(--purple);
        visibility: hidden;
        rotate: 70deg;
        scale: 0;
        translate: -0.4rem -0.4rem;
        transform-origin: 1em 1em;
        transition: rotate 0.8s var(--spring-easing), visibility 0.8s,
            scale 0.2s;
        border-radius: 1em;
        background-color: var(--bg);
    }
    ul {
        list-style: none;
        padding: var(--size-3);
    }
    li {
        margin-block: var(--size-1);
    }

    .panel.isOpen {
        visibility: visible;
        rotate: 0deg;
        scale: 1;
    }

    a {
        text-decoration: none;
    }

    .inner {
        line-height: 1;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        --purple-fill: radial-gradient(
                170.26% 170.26% at 111.61% 118.75%,
                rgba(255, 255, 255, 0.4) 0%,
                rgba(98, 0, 255, 0.4) 50%,
                rgba(255, 255, 255, 0.4) 100%
            ),
            #6200ff;
        background: var(--purple-fill);
        background-size: 200% 200%;
        background-position: 80% 80%;
        border-radius: 100%;
        color: white;
        transform: translateY(-3px);
        transition: inherit;
    }
    .isOpen .inner {
        background-position: 60% 60%;
        transform: scale(0.9) translateY(0);
    }
    .isOpen.button {
        background-position: 40% 40%;
    }
    .button {
        width: var(--size);
        height: var(--size);
        padding: 3px;
        border-radius: 100%;
        --purple-fill-back: radial-gradient(
                111.94% 111.94% at 14.84% 14.84%,
                rgba(246, 240, 255, 0.6) 0%,
                rgba(76, 5, 189, 0.6) 50%,
                rgba(246, 240, 255, 0.6) 100%
            ),
            #6200ff;
        filter: drop-shadow(0px 0px 0px rgba(0, 0, 0, 0.26))
            drop-shadow(0px 1px 2px rgba(0, 0, 0, 0.26))
            drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.22))
            drop-shadow(1px 8px 5px rgba(0, 0, 0, 0.13))
            drop-shadow(2px 14px 6px rgba(0, 0, 0, 0.04))
            drop-shadow(3px 22px 6px rgba(0, 0, 0, 0));
        background: var(--purple-fill-back);
        font-weight: bold;
        background-position: 20% 20%;
        background-size: 200% 200%;
        transition-property: all;
        transition: all 0.4s var(--spring-easing);
    }
</style>
