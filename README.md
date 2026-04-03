# Plaintext Security

Polished static security education website built with plain HTML, CSS, and JavaScript for GitHub Pages.

## Stack

- Plain HTML routes
- Plain CSS (`/assets/css/base.css`, `/assets/css/components.css`, `/assets/css/pages.css`)
- Plain JavaScript (`/assets/js/site.js`, `/assets/js/content-data.js`)
- No framework, no build step, no server dependency

## Included pages

- Home: `/index.html`
- QR Safety: `/qr-safety/index.html`
- QR Landing (legacy homepage): `/qr-landing/index.html`
- Scam Library: `/scams/index.html`
- What To Do Now: `/response/index.html`
- Security Basics: `/basics/index.html`
- Developer Security: `/developer-security/index.html`
- AI & Automation Risks: `/ai-risks/index.html`
- Blog: `/blog/index.html`
- Roadmap: `/roadmap/index.html`
- Dating Sim Concept: `/roadmap/dating-sim.html`
- Dating Sim Prototype: `/roadmap/dating-sim-prototype.html`
- About: `/about/index.html`
- Submit a Scam: `/submit/index.html`
- Custom 404: `/404.html`
- Printable QR one-pager: `/qr-safety/printable.html`

Each section includes starter article/detail pages as real static routes.

## Architecture notes

- Shared header/footer are injected by `assets/js/site.js` for consistency and easier maintenance.
- Article/index metadata is stored in `assets/js/content-data.js` and mirrored by section under `content/<section>/index.json`.
- Index pages use lightweight client-side rendering for:
  - latest guides on home
  - section filtering (search + tag chips)
  - related articles blocks on detail pages
  - QR mini-quiz interaction
  - dating-sim branching prototype interaction

## Local preview

Run a static server in project root:

```bash
python3 -m http.server 8080
```

Open [http://localhost:8080/](http://localhost:8080/).

## GitHub Pages deployment

### Project Pages

Use when your site URL is `https://<user>.github.io/<repo>/`.

1. Push this project to GitHub.
2. Go to repository **Settings → Pages**.
3. Set source to your main branch root (or `/docs` if you move files there).
4. Save and wait for deployment.

### User/Organization Pages

Use when your site URL is `https://<user>.github.io/`.

1. Publish from a repo named `<user>.github.io`.
2. Enable Pages from branch root.

This project uses relative links, so both hosting modes work without base-path rewrites.

## SEO and host placeholders

- `feed.xml`, `sitemap.xml`, and `robots.txt` currently use `https://example.com/`.
- Replace with your real production domain before launch.

## Branding rename

To rename “Plaintext Security” globally:

1. Update `brand` in `/assets/js/content-data.js`.
2. Update route-level titles/descriptions if you want brand changes in per-page metadata.
3. Update this README and any remaining copy.

## Form note

`/submit/index.html` is a static UI mockup only. Wire it to your preferred backend/form endpoint when needed.
