<script lang="ts">
    import type { MarkdownHeading } from "astro";
    import { scope } from "simple:scope";

    let isOpen = false;

    export let headings: MarkdownHeading[];
</script>

<div class="container">
    <ul class:isOpen id={scope("panel")} role="list" class="panel">
        {#each headings as h}
            <li><a href={`#${h.slug}`}>{h.text}</a></li>
        {/each}
    </ul>
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
        --shadow-color: 0deg 0% 30%;
        --shadow-elevation-high: 0.1px 0.4px 0.5px
                hsl(var(--shadow-color) / 0.1),
            0.6px 2.1px 2.5px -0.5px hsl(var(--shadow-color) / 0.1),
            1.2px 4.2px 4.9px -1px hsl(var(--shadow-color) / 0.1),
            2.3px 8px 9.4px -1.5px hsl(var(--shadow-color) / 0.1),
            4.1px 14.7px 17.3px -2px hsl(var(--shadow-color) / 0.1),
            7.1px 25.3px 29.8px -2.4px hsl(var(--shadow-color) / 0.1);
        box-shadow: var(--shadow-elevation-high);
        border: 3px solid var(--purple);
        visibility: hidden;
        rotate: 70deg;
        scale: 0;
        translate: -0.4rem -0.4rem;
        transform-origin: 1em 1em;
        transition: rotate 0.8s var(--spring-easing), visibility 0.8s,
            scale 0.2s;
        list-style: none;
        padding: 2rem;
        padding-block-start: 4rem;
        border-radius: 1em;
        background-color: var(--bg);
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
