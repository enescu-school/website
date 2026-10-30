/* ============================================================
   Enescu School of Music — main.js
   ============================================================ */

// ── Footer year ──
const yr = document.getElementById('year');
if (yr) yr.textContent = new Date().getFullYear();

// ── Sticky header ──
const header = document.getElementById('site-header');
if (header) {
  const tick = () => header.classList.toggle('scrolled', window.scrollY > 30);
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

// ── Mobile nav toggle ──
const toggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (toggle && navMenu && header) {
  const setOpen = (open) => {
    navMenu.classList.toggle('open', open);
    header.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(!navMenu.classList.contains('open')));
  navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) { setOpen(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setOpen(false); });
}

// ── Play videos only while visible; respect reduced motion ──
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('video').forEach(v => {
  if (reduceMotion) { v.removeAttribute('autoplay'); v.pause(); }
});
const videos = document.querySelectorAll('video[data-autoplay]');
if (!reduceMotion && videos.length && 'IntersectionObserver' in window) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.play().catch(() => {}); }
      else { entry.target.pause(); }
    });
  }, { threshold: 0.25 });
  videos.forEach(v => obs.observe(v));
}
