# Sandbox for Creative Entrepreneurs

Course companion website for Hanken School of Economics.

Deployment pipeline: GitHub → Netlify continuous deployment enabled. Every push to `main` builds and publishes automatically to `https://realsandbox.netlify.app/`.

## Edit the site

- `index.html` — page content and structure
- `assets/site-v2.css` — base layout, colours, responsive design
- `assets/journey-4x2.css` — overrides for the "melting pot" drag game and journey board (loads after `site-v2.css` and wins the cascade on shared selectors)
- `assets/script-v2.js` — reveal animations, official-view photo effect, drag/game logic, journey board logic
- `assets/favicon.svg` — browser icon
- `netlify.toml` — Netlify publishing/security configuration

No external JavaScript libraries or frameworks are used.
