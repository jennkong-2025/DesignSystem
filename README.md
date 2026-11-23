# DesignSystem
A repository for all work related to design systems
This folder contains skills to:
1. Understanding of the Anatomy Design System in Figma
2. Monitor any figma file for DS component usage
3. Write component specs for each component in the Anatomy Design System
4. Create a change log of section specific changes in the Anatomy Design System

## Website
The Anatomy design system reference site lives in [`docs/`](docs/) and is plain static HTML/CSS/JS (no build step).

- `docs/index.html` — Components
- `docs/foundations.html` — Foundations
- `docs/css/`, `docs/js/` — page styles and scripts
- `docs/assets/` — Figtree fonts and component images

Preview locally: `python3 -m http.server 8126 --directory docs` then open http://localhost:8126.

Publish: in GitHub → Settings → Pages, set **Deploy from a branch** → `main` / `/docs`. The site will be at https://jennkong-2025.github.io/DesignSystem/.
