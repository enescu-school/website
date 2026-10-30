# Enescu School of Music website — notes for editing

- Static site assembled by `build.js` (plain Node, no dependencies) into `dist/`; Netlify runs it via `netlify.toml`. See README.md for the layout.
- Shared parts live ONCE: school details + menu in `src/site.json`, `<head>`/header/footer in `src/partials/`. Page content in `src/pages/` (settings block at top). Static files in `public/`. Never edit or commit `dist/`.
- Use `{{ site.* }}` placeholders instead of typing the phone/email/address. Run `node build.js` before pushing — it fails loudly on unknown placeholders.
- Every push to `main` deploys to enescuschool.com automatically. Keep commits small with clear messages.
- Header logo: desktop shows `logo-header.png` (text-only) at the top and `logo-horizontal.png` once scrolled; phones/tablets (≤1024px) always show `logo-horizontal.png`. ☰ menu at ≤900px.
- Brand: EB Garamond logo; site fonts Playfair Display + DM Sans; gold #C9A252 on near-black.
- Content rules: no invented teachers, credentials, stats, or testimonials. Real reviews only, with permission.
- Booking form = Netlify Forms (`name="lesson-request"`, hidden `form-name`, honeypot `company`). Keep those attributes.
- Check changes at phone (390px), tablet (768/1024px) and desktop (1440px) widths before pushing.

## Working together (Christian in VS Code + Claude)
- GitHub `main` is the shared source of truth. Both of us pull before editing and push when done.
- Claude: always `git fetch` + rebase onto `origin/main` before editing; never force-push or rewrite history.
- Claude's commits are authored as "Mike L." (user's choice, from Oct 30, 2026) so the history shows who changed what; Christian's commits use his GitHub name. Keep the Co-Authored-By/Claude-Session trailers in every commit message.
- If both of us changed the same lines, resolve the conflict by keeping both intentions and ask Christian if unclear.
