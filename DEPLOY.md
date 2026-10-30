# Hosting setup (Netlify + Porkbun)

- **Netlify project:** `enescu-school` (team "Enescu School of Music"), connected to GitHub `enescu-school/website`.
- **Build:** defined in `netlify.toml` — Netlify runs `node build.js` and publishes `dist/`. Settings in that file override the Netlify dashboard.
- **Deploys:** merging into `main` publishes enescuschool.com; every pull request gets a Deploy Preview link (visible to Netlify team members).
- **Booking form:** Netlify → Forms. Add an email notification under Forms → Form notifications so requests reach your inbox.
- **Domain:** enescuschool.com at Porkbun. DNS: `ALIAS @ → apex-loadbalancer.netlify.com`, `CNAME www → enescu-school.netlify.app`.
  Keep Porkbun's MX and SPF TXT records — they handle email forwarding for info@enescuschool.com.
- **HTTPS:** Let's Encrypt certificate issued and renewed automatically by Netlify.
- **Extra domains** (enescuschoolofmusic.com, enescoschool.com, enescoschoolofmusic.com, enescumusicschool.com, enescomusicschool.com):
  forward to https://enescuschool.com with Porkbun URL forwarding.
