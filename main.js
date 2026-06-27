/* ============================================================
   SIDDESH PATIL — PORTFOLIO SCRIPTS
   main.js
   ============================================================ */


/* ============================================================
   1. NAV — SCROLLED STATE
   ============================================================ */

window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
});


/* ============================================================
   2. SCROLL REVEAL
   ============================================================ */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('in'), i * 70);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .06 });

document.querySelectorAll('.fi').forEach(el => revealObserver.observe(el));


/* ============================================================
   3. THEME TOGGLE — LIGHT / DARK
   ============================================================ */

const themeToggle = document.getElementById('themeToggle');

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
});