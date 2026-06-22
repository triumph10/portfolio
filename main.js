/* ============================================================
   SIDDESH PATIL — PORTFOLIO SCRIPTS
   main.js
   ============================================================ */


/* ============================================================
   1. LOADER — CV DETECTION BOX CANVAS ANIMATION
   ============================================================ */

const canvas = document.getElementById('lc');
const ctx    = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const boxes = Array.from({ length: 13 }, () => ({
  x:    Math.random() * .84 + .04,
  y:    Math.random() * .84 + .04,
  w:    Math.random() * .15 + .06,
  h:    Math.random() * .10 + .04,
  a:    Math.random(),
  spd:  Math.random() * .005 + .002,
  conf: (.55 + Math.random() * .42).toFixed(2),
  lbl:  ['face','obj','subject','target','entity','person',
         'body','form','human','figure','instance','node','shape']
         [Math.floor(Math.random() * 13)]
}));

let frame = 0;
let rafId;

function drawBox(b) {
  const W  = canvas.width;
  const H  = canvas.height;
  const x  = b.x * W;
  const y  = b.y * H;
  const w  = b.w * W;
  const h  = b.h * H;
  const sz = 11;

  const a = b.a * .55;
  ctx.strokeStyle = `rgba(226, 221, 212, ${a})`;
  ctx.lineWidth   = 1.5;

  ctx.beginPath();
  ctx.moveTo(x,      y + sz); ctx.lineTo(x,     y    ); ctx.lineTo(x + sz,  y    );
  ctx.moveTo(x+w-sz, y     ); ctx.lineTo(x + w, y    ); ctx.lineTo(x + w,   y+sz );
  ctx.moveTo(x,      y+h-sz); ctx.lineTo(x,     y + h); ctx.lineTo(x + sz,  y + h);
  ctx.moveTo(x+w-sz, y + h ); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w,   y+h-sz);
  ctx.stroke();

  ctx.fillStyle = `rgba(226, 221, 212, ${a * .8})`;
  ctx.font      = '10px Geist Mono, monospace';
  ctx.fillText(b.lbl + ' ' + b.conf, x, y - 5);
}

function loaderLoop() {
  rafId = requestAnimationFrame(loaderLoop);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  frame++;
  boxes.forEach(b => {
    b.a = .3 + Math.abs(Math.sin(frame * b.spd * 10)) * .7;
    drawBox(b);
  });
}
loaderLoop();

const lpct = document.getElementById('lpct');
let pct = 0;

const loadTick = setInterval(() => {
  pct = Math.min(pct + Math.random() * 3.2 + .5, 100);
  lpct.textContent = Math.floor(pct) + '%';

  if (pct >= 100) {
    clearInterval(loadTick);
    setTimeout(() => {
      cancelAnimationFrame(rafId);

      const loader = document.getElementById('loader');
      loader.style.transition = 'opacity .65s ease';
      loader.style.opacity    = '0';

      document.getElementById('main').classList.add('visible');

      setTimeout(() => {
        loader.style.display = 'none';
        startNameFlip();
      }, 700);
    }, 280);
  }
}, 48);


/* ============================================================
   2. DIGITAL FLIP NAME ANIMATION
   ============================================================ */

const NAME_FROM = 'Cdesh Patil';
const NAME_TO   = 'Siddesh Patil';

const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP0123456789_-';

function randChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

function buildSlots(str, container) {
  container.innerHTML = '';
  str.split('').forEach(ch => {
    if (ch === ' ') {
      const sp     = document.createElement('span');
      sp.className = 'cn-space';
      container.appendChild(sp);
    } else {
      const slot   = document.createElement('span');
      slot.className = 'cn';

      const outEl          = document.createElement('span');
      outEl.className      = 'cn-out';
      outEl.textContent    = ch;

      const inEl           = document.createElement('span');
      inEl.className       = 'cn-in';
      inEl.textContent     = ch;
      inEl.style.opacity   = '0';

      slot.appendChild(outEl);
      slot.appendChild(inEl);
      container.appendChild(slot);
    }
  });
}

const nameContainer = document.getElementById('heroName');
buildSlots(NAME_FROM, nameContainer);

function flipSlot(slot, newChar) {
  const outEl = slot.querySelector('.cn-out');
  const inEl  = slot.querySelector('.cn-in');

  let scrambles = 0;
  const MAX_SCRAMBLES = 3;

  const scrambleInterval = setInterval(() => {
    outEl.textContent = randChar();
    scrambles++;

    if (scrambles >= MAX_SCRAMBLES) {
      clearInterval(scrambleInterval);

      inEl.textContent   = newChar;
      inEl.style.opacity = '1';
      slot.classList.add('flipping');

      setTimeout(() => {
        outEl.textContent  = newChar;
        slot.classList.remove('flipping');
        inEl.style.opacity = '0';
      }, 340);
    }
  }, 60);
}

function startNameFlip() {
  setTimeout(() => {
    const fromArr = NAME_FROM.split('');
    const toChars = NAME_TO.split('');

    nameContainer.innerHTML = '';
    const slots = [];

    toChars.forEach((ch, i) => {
      if (ch === ' ') {
        const sp     = document.createElement('span');
        sp.className = 'cn-space';
        nameContainer.appendChild(sp);
        slots.push(null);
      } else {
        const slot     = document.createElement('span');
        slot.className = 'cn';

        const outEl       = document.createElement('span');
        outEl.className   = 'cn-out';
        const fromIdx     = i - 2;
        outEl.textContent = (
          fromIdx >= 0 &&
          fromIdx < fromArr.length &&
          fromArr[fromIdx] !== ' '
        ) ? fromArr[fromIdx] : randChar();

        const inEl           = document.createElement('span');
        inEl.className       = 'cn-in';
        inEl.textContent     = ch;
        inEl.style.opacity   = '0';

        slot.appendChild(outEl);
        slot.appendChild(inEl);
        nameContainer.appendChild(slot);
        slots.push(slot);
      }
    });

    let idx = 0;
    slots.forEach((slot, i) => {
      if (!slot) return;
      const delay     = idx * 90;
      const finalChar = toChars[i];
      idx++;
      setTimeout(() => flipSlot(slot, finalChar), delay);
    });

  }, 500);
}


/* ============================================================
   3. NAV — SCROLLED STATE
   ============================================================ */

window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
});


/* ============================================================
   4. SCROLL REVEAL
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