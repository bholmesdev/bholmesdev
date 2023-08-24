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
        position: absolute;
        min-width: 10em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;

        list-style: none;
        padding: 2rem;
        padding-block-start: 3rem;
        border-radius: 1em;
        background-color: var(--bg);
        --shadow-color: 0deg 0% 68%;
        --shadow-elevation-high: -0.2px 0.2px 0.3px
                hsl(var(--shadow-color) / 0.32),
            -0.9px 1.2px 1.7px -0.4px hsl(var(--shadow-color) / 0.32),
            -1.7px 2.3px 3.2px -0.8px hsl(var(--shadow-color) / 0.32),
            -2.9px 3.9px 5.5px -1.2px hsl(var(--shadow-color) / 0.32),
            -5px 6.7px 9.4px -1.7px hsl(var(--shadow-color) / 0.32),
            -8.2px 10.9px 15.3px -2.1px hsl(var(--shadow-color) / 0.32),
            -12.8px 17.2px 24.1px -2.5px hsl(var(--shadow-color) / 0.32);
        box-shadow: var(--shadow-elevation-high);
        border: 2px solid var(--purple);
        visibility: hidden;
        transform: rotate(180deg);
        transform-origin: 1em 1em;
        opacity: 0;
        transition: transform 0.8s var(--spring-easing), visibility 0.8s,
            opacity 0.1s;
    }
    .panel.isOpen {
        visibility: visible;
        transform: rotate(0deg);
        opacity: 1;
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
