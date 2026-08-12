# NeuroLab Command Center

The master entry point for NeuroLab's public publications, served at
**https://neurolab-ai.github.io/**.

A single-page shell with a persistent navigation bar that switches between:

- **Overview** — publication cards and direct links (default view)
- **Roadmap** — https://neurolab-ai.github.io/roadmap/
- **Project Deck** — https://neurolab-ai.github.io/roadmap/deck/
- **Whitepaper** — https://neurolab-ai.github.io/whitepaper/

Views load lazily into same-origin embedded frames (each publication passes
`?embed=1` to suppress its own masthead) and stay mounted once opened, so
carousel positions, filters, and reading positions persist while switching.
The URL tracks the active view (`/?view=roadmap`) via the History API, so
deep links and the back button work. Each publication remains independently
addressable at its own URL.

## Layout

- `site/` — static shell (`index.html`, `styles.css`, `app.js`, `assets/`)
- `.github/workflows/deploy-pages.yml` — GitHub Pages deployment on push to `main`

No build step: the `site/` directory is deployed as-is.
