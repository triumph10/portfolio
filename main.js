function toggleTheme(){
    const html = document.documentElement;
    const isDark = html.getAttribute('data-theme') === 'dark';
    html.setAttribute('data-theme', isDark ? 'light' : 'dark');
    document.getElementById('themeIcon').textContent = isDark ? '🌙' : '☀️';
    document.getElementById('ghchart').src = isDark
      ? 'https://ghchart.rshah.org/1a7a45/triumph10'
      : 'https://ghchart.rshah.org/5eff9b/triumph10';
  }

  function toggleFlat(el){
    const item = el.closest('.flat-item');
    item.classList.toggle('open');
  }

  // ── SIMPLE STAGGERED LANDING (no orbit) ─────────────────────────
  // Icons drop into place one by one, straight and clean. No revolution.
  window.addEventListener('load', () => {
    const slots = Array.from(document.querySelectorAll('#socialRow .sicon'));
    slots.forEach((slot, i) => {
      setTimeout(() => {
        slot.classList.add('landed');
      }, 400 + i * 130);
    });
  });