# Project setup

This project is built using [Astro.](https://astro.build) To run this project on your machine:

- Set up [node v20+](https://nodejs.org/en/download/package-manager) and [pnpm](https://pnpm.io/installation)
- Install project dependencies from your terminal: `pnpm i`
- Start the development server: `pnpm dev`

## Optional third party services

Interactive features including the like button and newsletter sign-up form rely on third-party services:

- [Upstash](https://upstash.com/) for persisted storage
- [Buttondown API](https://docs.buttondown.email/api-introduction) for newsletter signups

To try these features locally, you will need to generate API credentials by creating accounts for each. Place these credentials in a `.env` file following the `.env.example` file as a template.

## Production deployment

This project is configured to [deploy using Netlify.](https://www.netlify.com/blog/2016/09/29/a-step-by-step-guide-deploying-on-netlify/) To use a different deployment host, [learn more about Astro deployment adapters.](https://docs.astro.build/en/reference/adapter-reference/)

## Project Structure

This project follows the standard structure of an Astro codebase:

```bash
/
├── public/
│   └── favicon.png
├── src/
│   ├── actions/ # backend functions
│   ├── content/ # blog posts written with Markdoc
│   ├── icons/ # reusable icons using astro-icon
│   ├── lib/ # library-specific code
│   ├── components/ # reusable Astro components
│   ├── layouts/
│   └── pages/
└── package.json
```

## Astro commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `pnpm dev`             | Starts local dev server at `localhost:4321`      |
| `pnpm build`           | Build your production site to `./dist/`          |
| `pnpm preview`         | Preview your build locally, before deploying     |
| `pnpm astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `pnpm astro -- --help` | Get help using the Astro CLI                     |

