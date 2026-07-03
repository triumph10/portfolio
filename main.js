function toggleTheme(){
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeIcon').textContent = isDark ? '🌙' : '☀️';
    document.getElementById('ghchart').src = isDark
      ? 'https://ghchart.rshah.org/1a7a45/triumph10'
      : 'https://ghchart.rshah.org/5eff9b/triumph10';

    // little spin flourish on the toggle button itself
    const btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.classList.remove('spin');
      void btn.offsetWidth; // force reflow so the animation can restart
      btn.classList.add('spin');
    }
  }

  function toggleFlat(el){
    const item = el.closest('.flat-item');
    item.classList.toggle('open');
  }

  // ── SIMPLE STAGGERED LANDING (no orbit) ─────────────────────────
  // Icons drop into place one by one, straight and clean. No revolution.
  // Once settled, each icon eases into a gentle, staggered float loop.
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    const slots = Array.from(document.querySelectorAll('#socialRow .sicon'));
    slots.forEach((slot, i) => {
      setTimeout(() => {
        slot.classList.add('landed');
        setTimeout(() => {
          slot.style.animationDelay = `${i * 0.2}s`;
          slot.classList.add('float-idle');
        }, 480);
      }, 400 + i * 130);
    });
  });

  // ── SCROLL REVEAL ─────────────────────────────────────────────
  // Sections and cards fade + rise into place as they enter the viewport.
  document.addEventListener('DOMContentLoaded', () => {
    const revealTargets = document.querySelectorAll('section, .coll-card, .flat-item, .edu, .gh-box');
    revealTargets.forEach(el => el.classList.add('reveal'));

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

      revealTargets.forEach(el => revealObserver.observe(el));
    } else {
      revealTargets.forEach(el => el.classList.add('in-view'));
    }
  });

  // ── BUTTERY-SMOOTH ANCHOR SCROLLING ─────────────────────────────
  // Overrides the jump-scroll on in-page nav links with an eased scroll,
  // and accounts for the sticky nav height so sections don't hide behind it.
  function easeInOutCubic(t){
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function smoothScrollTo(targetY, duration){
    const startY = window.scrollY;
    const diff = targetY - startY;
    const startTime = performance.now();
    function step(now){
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      window.scrollTo(0, startY + diff * easeInOutCubic(progress));
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (!id || id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;

    e.preventDefault();
    const nav = document.querySelector('nav');
    const navHeight = nav ? nav.offsetHeight : 0;
    const targetY = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;
    smoothScrollTo(Math.max(targetY, 0), 750);
    history.pushState(null, '', id);
  });

  // ── GA4 SECTION VIEW TRACKING ──────────────────────────────
if (typeof gtag === 'function') {
  const trackedSections = document.querySelectorAll('section[id]');
  const seen = new Set();

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !seen.has(entry.target.id)) {
        seen.add(entry.target.id);
        gtag('event', 'section_view', {
          section_id: entry.target.id
        });
      }
    });
  }, { threshold: 0.4 });

  trackedSections.forEach(el => sectionObserver.observe(el));
}