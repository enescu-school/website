#!/usr/bin/env node
/*
  Enescu School of Music: site builder (no dependencies, plain Node.js)

  Assembles every page in src/pages/ with the shared pieces in src/partials/
  and the school's details in src/site.json, then copies public/ alongside.
  The finished site goes to dist/, which is what Netlify publishes.

    node build.js           build once into dist/
    node build.js --serve   build, serve at http://localhost:8080, rebuild on every save

  Placeholders you can use in partials AND pages:
    {{ site.name }}  {{ site.phone }}  {{ site.email }}  {{ site.address.street }} ...
    {{ year }}  (the current year, filled in at build time)
  Page files start with a small settings block:
    ---
    title: Page title for the browser tab and Google
    description: One-sentence summary for Google
    path: about.html          (address of the page; leave empty for the home page)
    ---
  Optional extra <head> content goes between <!-- head --> and <!-- /head -->.
*/
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const PUBLIC = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'dist');

const escapeHtml = (s) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const lookup = (obj, dotted) => dotted.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

function fill(template, data, where) {
  return template.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (m, key) => {
    const value = lookup(data, key);
    if (value === undefined) throw new Error(`Unknown placeholder {{ ${key} }} in ${where}`);
    return value;
  });
}

function readPage(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const fm = raw.match(/^---\n([\s\S]*?)\n---\n/);
  if (!fm) throw new Error(`${path.basename(file)} is missing its --- settings block --- at the top`);
  const settings = {};
  for (const line of fm[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) settings[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  for (const key of ['title', 'description']) {
    if (!settings[key]) throw new Error(`${path.basename(file)} needs a "${key}:" line in its settings block`);
  }
  let body = raw.slice(fm[0].length);
  let head = '';
  const h = body.match(/^<!-- head -->([\s\S]*?)\n<!-- \/head -->\n/);
  if (h) { head = h[1]; body = body.slice(h[0].length); }
  return { settings, head, body: body.replace(/\n$/, '') };
}

function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const a = path.join(from, entry.name), b = path.join(to, entry.name);
    entry.isDirectory() ? copyDir(a, b) : fs.copyFileSync(a, b);
  }
}

function build() {
  const started = Date.now();
  const site = JSON.parse(fs.readFileSync(path.join(SRC, 'site.json'), 'utf8'));
  const partial = (n) => fs.readFileSync(path.join(SRC, 'partials', n + '.html'), 'utf8');
  const [head, header, footer] = ['head', 'header', 'footer'].map(partial);

  fs.rmSync(OUT, { recursive: true, force: true });
  copyDir(PUBLIC, OUT);

  const pages = fs.readdirSync(path.join(SRC, 'pages')).filter((f) => f.endsWith('.html')).sort();
  for (const file of pages) {
    const { settings, head: pageHead, body } = readPage(path.join(SRC, 'pages', file));
    const pagePath = settings.path === undefined ? file : settings.path;
    const navItems = site.nav.map((item) => (item.href === file
      ? `          <li><a href="${item.href}" class="active" aria-current="page">${item.label}</a></li>`
      : `          <li><a href="${item.href}">${item.label}</a></li>`)).join('\n');
    const data = {
      site,
      navItems,
      year: String(new Date().getFullYear()),
      page: {
        title: escapeHtml(settings.title),
        description: escapeHtml(settings.description),
        url: `${site.url}/${pagePath}`,
        head: '',
      },
    };
    data.page.head = fill(pageHead, data, `${file} (head block)`);
    const html = fill(head, data, 'partials/head.html')
      + fill(header, data, 'partials/header.html')
      + '\n' + fill(body, data, `pages/${file}`) + '\n'
      + fill(footer, data, 'partials/footer.html');
    fs.writeFileSync(path.join(OUT, file), html);
  }
  console.log(`Built ${pages.length} pages into dist/ in ${Date.now() - started} ms`);
}

function serve(port = 8080) {
  const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
    '.mp4': 'video/mp4', '.xml': 'application/xml', '.txt': 'text/plain', '.json': 'application/json' };
  http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    if (p.endsWith('/')) p += 'index.html';
    let file = path.join(OUT, path.normalize(p).replace(/^(\.\.[/\\])+/, ''));
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.statusCode = 404; file = path.join(OUT, '404.html'); }
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  }).listen(port, () => console.log(`Preview at http://localhost:${port}  (Ctrl+C to stop)`));

  // Check twice a second whether anything in src/ or public/ changed. Polling is
  // reliable with every editor and operating system, and cheap for a small site.
  const fingerprint = () => {
    const parts = [];
    const walk = (dir) => {
      for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
        const p = path.join(dir, e.name);
        if (e.isDirectory()) walk(p);
        else { const s = fs.statSync(p); parts.push(`${p}:${s.size}:${s.mtimeMs}`); }
      }
    };
    walk(SRC); walk(PUBLIC);
    return parts.join('|');
  };
  let last = fingerprint();
  setInterval(() => {
    let now;
    try { now = fingerprint(); } catch { return; } // a file was mid-save; try again next tick
    if (now === last) return;
    last = now;
    try { build(); } catch (e) { console.error('Build failed:', e.message); }
  }, 500);
  console.log('Watching src/ and public/ for changes...');
}

try {
  build();
} catch (e) {
  console.error('Build failed:', e.message);
  process.exit(1);
}
if (process.argv.includes('--serve')) serve();
