/* ============================================================
   SIDDESH PATIL — PORTFOLIO SCRIPTS
   main.js
   ============================================================ */


/* ============================================================
   1. LOADER — CV DETECTION BOX CANVAS ANIMATION
   Draws scattered bounding-box corner brackets on a canvas,
   mimicking an OpenCV / computer-vision object detector.
   No center square, no scan line — just ambient bg boxes.
   ============================================================ */

const canvas = document.getElementById('lc');
const ctx    = canvas.getContext('2d');

/* Resize canvas to fill the viewport */
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

/* Generate random detection boxes scattered across the screen.
   Each box has position, size, opacity, animation speed,
   a fake confidence score, and a random object label.         */
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

/* Draw a single detection box — corner brackets only, no full rect */
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
  /* top-left */
  ctx.moveTo(x,      y + sz); ctx.lineTo(x,     y    ); ctx.lineTo(x + sz,  y    );
  /* top-right */
  ctx.moveTo(x+w-sz, y     ); ctx.lineTo(x + w, y    ); ctx.lineTo(x + w,   y+sz );
  /* bottom-left */
  ctx.moveTo(x,      y+h-sz); ctx.lineTo(x,     y + h); ctx.lineTo(x + sz,  y + h);
  /* bottom-right */
  ctx.moveTo(x+w-sz, y + h ); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w,   y+h-sz);
  ctx.stroke();

  ctx.fillStyle = `rgba(226, 221, 212, ${a * .8})`;
  ctx.font      = '10px Geist Mono, monospace';
  ctx.fillText(b.lbl + ' ' + b.conf, x, y - 5);
}

/* Main render loop — runs while loader is visible */
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

/* ── LOADER PROGRESS ──
   Fake progress increments randomly until 100,
   then fades out loader and fades in #main.     */
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
        /* Start the flip AFTER main is visible so user sees Cdesh Patil first */
        startNameFlip();
      }, 700);
    }, 280);
  }
}, 48);


/* ============================================================
   2. DIGITAL FLIP NAME ANIMATION

   Flow:
   1. On script load (sync, before loader finishes) — immediately
      render "Cdesh Patil" into #heroName so it's visible the
      moment #main fades in.
   2. After loader completes + 500ms pause — flip each character
      slot left-to-right to reveal "Siddesh Patil".

   Each character is a .cn slot:
     .cn-out  — currently visible layer
     .cn-in   — incoming layer (hidden until flip fires)
   Spaces are .cn-space width-only elements.
   ============================================================ */

const NAME_FROM = 'Cdesh Patil';    /* shown first — capitalised */
const NAME_TO   = 'Siddesh Patil';  /* final correct name — capitalised */

const SCRAMBLE_CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOP0123456789_-';

function randChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

/* Build character slots for a string into a container element.
   Returns the container's child slot nodes for later flipping. */
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

/* ── STEP 1: Render FROM name immediately on page load ──
   Runs synchronously so "Cdesh Patil" is in the DOM before
   the loader even finishes. User sees it the instant the
   page fades in.                                           */
const nameContainer = document.getElementById('heroName');
buildSlots(NAME_FROM, nameContainer);


/* Flip a single .cn slot to newChar.
   Scrambles through random chars briefly (split-flap feel),
   then fires the CSS flipOut/flipIn keyframe animation.     */
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

/* ── STEP 2: After loader, flip FROM → TO ──
   Rebuilds container to NAME_TO length, pre-fills outEl chars
   to approximate NAME_FROM visually (offset by +2 since "Si"
   is prepended), then fires flips left-to-right 90ms apart.  */
function startNameFlip() {
  /* 500ms pause so user clearly reads "Cdesh Patil" first */
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
        /* Map FROM chars — NAME_TO has "Si" prepended so offset by 2 */
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

    /* Fire flips left-to-right, 90ms stagger per character */
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
   Adds .scrolled to nav after 60px, triggering frosted glass.
   ============================================================ */
window.addEventListener('scroll', () => {
  document.getElementById('navbar')
    .classList.toggle('scrolled', window.scrollY > 60);
});


/* ============================================================
   4. SCROLL REVEAL
   IntersectionObserver adds .in to .fi elements as they enter
   the viewport, triggering the fade-up CSS transition.
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