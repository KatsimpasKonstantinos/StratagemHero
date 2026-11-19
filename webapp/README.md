# Stratagem Hero – Webapp

React + TypeScript, built with [Vite+](https://viteplus.dev/guide) (`vite-plus`), which bundles Vite, Oxlint and Oxfmt into one toolchain (`vp`).

## Scripts

| Command           | Does                                   |
| ----------------- | -------------------------------------- |
| `npm run dev`     | Start the dev server (`vp dev`)        |
| `npm run build`   | Production build (`vp build`)          |
| `npm run preview` | Serve the production build locally     |
| `npm run lint`    | Type-aware lint + type check (`vp lint`) |

## Configuration

All tool configuration lives in [`vite.config.ts`](./vite.config.ts):

- `plugins` – React plugin with the [React Compiler](https://react.dev/learn/react-compiler) (via Babel)
- `lint` – Oxlint rules (replaces `.oxlintrc.json`), see the [Vite+ lint guide](https://viteplus.dev/guide/lint)
- `fmt` – Oxfmt options, see the [Vite+ fmt guide](https://viteplus.dev/guide/fmt)

`vite` in `package.json` is an alias for `@voidzero-dev/vite-plus-core`; keep it in sync with the `overrides` entry (use `vp migrate` to upgrade).
