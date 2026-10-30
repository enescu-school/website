# Enescu School of Music website — notes for editing

- Plain static site: HTML + `css/style.css` + `js/main.js`. No build step; Netlify publishes the repo root.
- Every push to `main` deploys to enescuschool.com automatically. Keep commits small with clear messages.
- Header and footer are repeated in each page (`index`, `instruments`, `about`, `schedule`, `contact`, `thank-you`, `404`). Change them in ALL pages.
- Header logo: desktop shows `logo-header.png` (text-only) at the top and `logo-horizontal.png` once scrolled; phones/tablets (≤1024px) always show `logo-horizontal.png`. ☰ menu at ≤900px.
- Brand: EB Garamond logo; site fonts Playfair Display + DM Sans; gold #C9A252 on near-black.
- Content rules: no invented teachers, credentials, stats, or testimonials. Real reviews only, with permission.
- Booking form = Netlify Forms (`name="lesson-request"`, hidden `form-name`, honeypot `company`). Keep those attributes.
- Check changes at phone (390px), tablet (768/1024px) and desktop (1440px) widths before pushing.

## Working together (Christian in VS Code + Claude)
- GitHub `main` is the shared source of truth. Both of us pull before editing and push when done.
- Claude: always `git fetch` + rebase onto `origin/main` before editing; never force-push or rewrite history.
- Claude's commits are authored as "Claude" so the history shows who changed what; Christian's commits use his GitHub name.
- If both of us changed the same lines, resolve the conflict by keeping both intentions and ask Christian if unclear.
