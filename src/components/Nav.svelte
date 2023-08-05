<script>
    let isNavOpen = true;
    let windowScroll = 0;

    $: isNavOpen = windowScroll === 0;
</script>

<svelte:window bind:scrollY={windowScroll} />

<nav class:isNavOpen>
    <!--<button>TOC</button>-->
    <ul id="nav__link-list" class="links">
        <li><a href="/">Ben</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/talks">Talks</a></li>
        <li><a href="/videos">Videos</a></li>
    </ul>
    <div class="toggle-bg">
        <button
            on:click={() => (isNavOpen = !isNavOpen)}
            aria-expanded={isNavOpen}
            aria-controls="nav__link-list"
            class="toggle"
        >
            <div class="stripe stripe-top" />
            <div class="stripe stripe-middle" />
            <div class="stripe stripe-bottom" />
        </button>
    </div>
</nav>

<style lang="scss">
    .toggle {
        height: 24px;
        width: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        position: relative;
    }
    .toggle::before {
        content: "";
        position: absolute;
        inset: -0.5rem;
        z-index: -1;
        border-radius: 0.7rem;
        background-color: var(--bg-blur);
    }

    .stripe {
        height: 4px;
        width: inherit;
        background-color: currentColor;
        transition: transform 0.2s ease-in-out;
        border-radius: 4px;
    }
    .stripe.stripe-middle {
        transform-origin: center center;
        transition-property: transform, opacity;
    }
    .stripe.stripe-top {
        transform-origin: top right;
    }
    .stripe.stripe-bottom {
        transform-origin: bottom right;
    }
    .isNavOpen .stripe-top {
        transform: rotate(-45deg);
    }
    .isNavOpen .stripe-middle {
        opacity: 0;
        transform: scaleX(0);
    }
    .isNavOpen .stripe-bottom {
        transform: rotate(45deg);
    }

    @for $i from 1 through 4 {
        li:nth-child(#{$i}) {
            opacity: 0;
            visibility: hidden;
            transform: translateX(17em - ($i * 3.5em));
            transition-delay: (4 - $i) * 50ms;
            pointer-events: none;
        }
    }
    li {
        transition: all 0.2s ease-in-out;
    }
    .isNavOpen li {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
        pointer-events: initial;
    }

    nav {
        position: sticky;
        top: 0;
        margin: auto;
        max-width: 100ch;
        display: flex;
        gap: 2rem;
        align-items: center;
        font-size: var(--font-size-md);
        padding-inline: 1rem;
        padding-block: 1rem;
        transition: background-color 0.2s ease-in-out;
    }
    nav.isNavOpen {
        background-color: var(--bg);
    }
    ul {
        list-style: none;
        display: flex;
        gap: inherit;
        margin-inline-start: auto;
        align-items: inherit;
    }
    a,
    a:visited {
        text-decoration: none;
    }
</style>
