# Enescu School of Music — website

Website for enescuschool.com. Plain HTML, CSS and JavaScript, assembled by a tiny build script (`build.js`, no dependencies — only Node.js is needed).
Hosted on Netlify, which runs the build and publishes `dist/` (settings in `netlify.toml`). Merging into `main` updates the live site.

## Where things live

| What | Where |
|---|---|
| School details used everywhere (name, phone, email, address, menu items) | `src/site.json` |
| Shared page parts: `<head>`, header with logo + menu, footer | `src/partials/head.html`, `header.html`, `footer.html` |
| Each page's own content (+ its title and description at the top) | `src/pages/*.html` |
| Styles, script, images, video, favicon, robots.txt, sitemap.xml, _redirects | `public/` (copied as-is) |
| Finished site (generated — never edit, not saved in Git) | `dist/` |

Change the phone number in `src/site.json` and it updates the header, footer, contact page and Google data on every page.
Change the footer once in `src/partials/footer.html` and every page gets it.

## Preview while you edit

```bash
node build.js --serve      # or: npm run dev   — or in VS Code: Terminal → Run Build Task (Cmd+Shift+B)
```
Open http://localhost:8080. Every time you save a file in `src/` or `public/`, the site rebuilds — refresh the browser to see it. Stop with Ctrl+C.
If you make a typo in a placeholder, the terminal says exactly which file and placeholder.

## Placeholders

Use these anywhere in partials or pages: `{{ site.name }}`, `{{ site.phone }}`, `{{ site.phoneLink }}`, `{{ site.email }}`,
`{{ site.address.street }}`, `{{ site.address.city }}`, `{{ site.address.state }}`, `{{ site.address.zip }}`.

## Adding a new page

1. Copy an existing file in `src/pages/` (e.g. `about.html`) to a new name, e.g. `faq.html`.
2. Edit the settings block at the top (`title`, `description`, `path: faq.html`) and the content inside `<main>`.
3. To show it in the top menu, add `{ "href": "faq.html", "label": "FAQ" }` to `nav` in `src/site.json`.
4. Add it to `public/sitemap.xml`.

## Other notes

- Booking form: Netlify Forms (`lesson-request`), notifications set in the Netlify dashboard.
- `public/_redirects`: old `instructors.html` → `about.html`.
- `DEPLOY.md`: hosting and domain setup.
