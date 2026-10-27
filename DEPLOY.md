# Putting enescuschool.com online (Netlify, free)

1. Create a free account at netlify.com.
2. Sites → "Add new site" → "Deploy manually" → drag this whole folder onto the page.
3. Booking form: Site configuration → Forms → enable form detection, then redeploy (drag the folder again).
   Under Forms → Form notifications → add an email notification so requests reach your inbox.
4. Domain: Domain management → Add domain → enescuschool.com. Netlify shows the DNS records to add;
   enter them in Porkbun (Domain → DNS). HTTPS turns on automatically after a few minutes.
5. Extra domains (enescuschoolofmusic.com, enescoschool.com, enescoschoolofmusic.com,
   enescumusicschool.com, enescomusicschool.com): add each as a "domain alias" in Netlify,
   or use Porkbun's URL forwarding to https://enescuschool.com.

Before launch:
- Set up the email address info@enescuschool.com (Porkbun email forwarding or Google Workspace) — it's on every page.
- Add parking/entrance directions on contact.html (search for "TODO").
