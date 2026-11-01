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

// ── Booking form: clear messages under each field + preferred-times picker ──
const bookingForm = document.querySelector('form[name="lesson-request"]');
if (bookingForm) {
  bookingForm.noValidate = true; // we show our own messages; without JS the browser's checks still apply
  const fields = [...bookingForm.querySelectorAll('input[required], select[required]')];

  const phoneDigitsOk = (v) => {
    const d = v.replace(/\D/g, '');
    return d.length === 10 || (d.length === 11 && d.startsWith('1'));
  };

  const check = (el) => {
    el.setCustomValidity('');
    if (el.hasAttribute('data-phone') && el.value.trim() && !phoneDigitsOk(el.value)) {
      el.setCustomValidity('invalid');
    }
    let msg = '';
    if (el.validity.valueMissing) msg = el.dataset.msgMissing || 'Please fill in this field.';
    else if (!el.validity.valid) msg = el.dataset.msgInvalid || el.dataset.msgMissing || 'Please check this field.';
    const box = document.getElementById(el.id + '-error');
    if (box) box.textContent = msg;
    el.classList.toggle('is-invalid', !!msg);
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    return !msg;
  };

  // Messages appear when "Send Request" is pressed (all at once), then update live as the
  // field is corrected. Nothing appears while tabbing/tapping between fields, so the layout
  // never shifts under a finger.
  fields.forEach((el) => {
    const recheck = () => { if (el.classList.contains('is-invalid')) check(el); };
    el.addEventListener('input', recheck);
    el.addEventListener('change', recheck);
  });

  // Preferred days & times: collect ticked boxes into one readable field for the email
  const hidden = document.getElementById('preferred-times');
  const slots = [...bookingForm.querySelectorAll('.time-cell input:not([data-flexible])')];
  const flexible = bookingForm.querySelector('[data-flexible]');
  const syncTimes = () => {
    if (!hidden) return;
    hidden.value = flexible && flexible.checked
      ? flexible.value
      : slots.filter((c) => c.checked).map((c) => c.value).join(', ');
  };
  slots.forEach((c) => c.addEventListener('change', () => {
    if (c.checked && flexible) flexible.checked = false;
    syncTimes();
  }));
  if (flexible) flexible.addEventListener('change', () => {
    if (flexible.checked) slots.forEach((c) => { c.checked = false; });
    syncTimes();
  });

  // Sending: a spinner shows over the form column for two seconds, then the form is sent the normal way
  // and the visitor lands on the Thank You page.
  const button = bookingForm.querySelector('button[type="submit"]');
  let sending = false;

  bookingForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (sending) return;
    syncTimes();
    const bad = fields.filter((el) => !check(el));
    if (bad.length) { bad[0].focus(); return; }

    sending = true;
    button.disabled = true;
    button.textContent = 'Sending…';
    bookingForm.parentElement.classList.add('is-sending');
    const spin = bookingForm.parentElement.querySelector('.form-sending-box');
    if (spin) spin.scrollIntoView({ behavior: 'smooth', block: 'center' });
    bookingForm.setAttribute('aria-busy', 'true');
    setTimeout(() => bookingForm.submit(), 2000);
  });

  // If the visitor comes back with the browser's Back button, reset the button.
  window.addEventListener('pageshow', () => {
    sending = false;
    button.disabled = false;
    button.textContent = 'Send Request';
    bookingForm.parentElement.classList.remove('is-sending');
    bookingForm.removeAttribute('aria-busy');
  });
}
