<script>
    let mainToggled = true;
</script>

<nav>
    <button>TOC</button>
    <ul id="nav__link-list" class:mainToggled class="links">
        <li><a href="/">Ben</a></li>
        <li><a href="/blog">Blog</a></li>
        <li><a href="/talks">Talks</a></li>
        <li><a href="/videos">Videos</a></li>
    </ul>
    <button
        on:click={() => (mainToggled = !mainToggled)}
        class:mainToggled
        aria-expanded={mainToggled}
        aria-controls="nav__link-list"
        class="toggle"
    >
        <div class="stripe stripe-top" />
        <div class="stripe stripe-middle" />
        <div class="stripe stripe-bottom" />
    </button>
</nav>

<style lang="scss">
    .toggle {
        height: 24px;
        width: 30px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
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
    .mainToggled > .stripe-top {
        transform: rotate(-45deg);
    }
    .mainToggled > .stripe-middle {
        opacity: 0;
        transform: scaleX(0);
    }
    .mainToggled > .stripe-bottom {
        transform: rotate(45deg);
    }

    @for $i from 1 through 4 {
        li:nth-child(#{$i}) {
            opacity: 0;
            visibility: hidden;
            transform: translateX(17em - ($i * 3.5em));
            pointer-events: none;
        }
    }
    li {
        transition: all 0.2s ease-in-out;
    }
    .mainToggled > li {
        opacity: 1;
        visibility: visible;
        transform: translateX(0);
        pointer-events: initial;
    }

    .stripe {
        height: 4px;
        width: inherit;
        background-color: currentColor;
        transition: transform 0.2s ease-in-out;
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
