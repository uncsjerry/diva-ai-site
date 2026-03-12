/* ==========================================================================
   DIVA AI — Teaser Site (Clean Redesign)
   Restrained, purposeful animation. No sparkle cannons.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCurtain();
  initHeroReveal();
  initScrollReveals();
  initQuoteCarousel();
  initStatCounters();
  initSignupForm();
});

/* --------------------------------------------------------------------------
   Curtain
   WHY: Quick, elegant curtain open — just enough to feel theatrical
   without making the user wait
   -------------------------------------------------------------------------- */

function initCurtain() {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;

  /* 1.8s lets both text lines animate in, then opens */
  setTimeout(() => curtain.classList.add('open'), 1800);
  /* Remove from DOM after transition completes */
  setTimeout(() => curtain.classList.add('done'), 3200);
}

/* --------------------------------------------------------------------------
   Hero Staggered Reveal
   WHY: Elements fade in top-to-bottom after the curtain clears,
   drawing the eye naturally through the hierarchy
   -------------------------------------------------------------------------- */

function initHeroReveal() {
  const els = document.querySelectorAll('.hero-content [data-reveal]');
  /* 2.2s base delay — curtain needs to finish opening first */
  const BASE_DELAY_MS = 2200;
  /* 180ms between each element — snappy but readable */
  const STAGGER_MS = 180;

  els.forEach((el, i) => {
    setTimeout(() => el.classList.add('revealed'), BASE_DELAY_MS + i * STAGGER_MS);
  });
}

/* --------------------------------------------------------------------------
   Scroll Reveals
   WHY: Intersection Observer triggers a single, clean fade-up.
   No stagger gimmicks — each element simply appears when in view.
   -------------------------------------------------------------------------- */

function initScrollReveals() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('[data-scroll-reveal]').forEach((el) => {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   Quote Carousel
   -------------------------------------------------------------------------- */

function initQuoteCarousel() {
  const slides = document.querySelectorAll('.quote-slide');
  const dotsContainer = document.getElementById('quoteDots');
  if (!slides.length || !dotsContainer) return;

  let current = 0;
  let timer;

  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'quote-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Quote ${i + 1}`);
    dot.addEventListener('click', () => { goTo(i); resetTimer(); });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.quote-dot');

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function resetTimer() {
    clearInterval(timer);
    startTimer();
  }

  function startTimer() {
    /* 5s per quote — comfortable reading pace */
    timer = setInterval(() => goTo((current + 1) % slides.length), 5000);
  }

  startTimer();
}

/* --------------------------------------------------------------------------
   Stat Counters
   -------------------------------------------------------------------------- */

function initStatCounters() {
  const nums = document.querySelectorAll('.stat-num[data-target]');
  if (!nums.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  nums.forEach((el) => observer.observe(el));
}

function countUp(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    /* Ease-out cubic — fast start, gentle land */
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target).toLocaleString();
    if (progress < 1) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
}

/* --------------------------------------------------------------------------
   Signup Form + Confetti
   WHY: Confetti is the ONE indulgence — it's a celebration moment
   and uses the brand palette. Everywhere else stays clean.
   -------------------------------------------------------------------------- */

function initSignupForm() {
  const form = document.getElementById('signupForm');
  const success = document.getElementById('signupSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]').value;
    if (!email) return;

    // TODO: Wire to email collection service (Mailchimp, ConvertKit, etc.)
    console.log('Email signup:', email);

    form.hidden = true;
    success.hidden = false;
    launchConfetti();
  });
}

/* --------------------------------------------------------------------------
   Confetti — Minimal, Brand-Colored
   WHY: Gold + blue confetti on signup is the ONE fun moment.
   150 pieces, quick fade, then gone.
   -------------------------------------------------------------------------- */

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const PIECE_COUNT = 120;
  /* WHY: Palette matches the brand — gold, blue, white, muted gold */
  const palette = ['#C9A84C', '#2D5BFF', '#FFFFFF', '#E8D89A', '#4F7AFF'];
  const pieces = [];

  for (let i = 0; i < PIECE_COUNT; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 250,
      y: canvas.height * 0.55,
      vx: (Math.random() - 0.5) * 12,
      vy: Math.random() * -16 - 4,
      size: Math.random() * 6 + 3,
      color: palette[Math.floor(Math.random() * palette.length)],
      rot: Math.random() * 360,
      rotV: (Math.random() - 0.5) * 8,
      gravity: 0.22 + Math.random() * 0.12,
      alpha: 1,
    });
  }

  let frame = 0;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = 0;

    for (const p of pieces) {
      if (p.alpha <= 0) continue;
      alive++;

      p.x += p.vx;
      p.vy += p.gravity;
      p.y += p.vy;
      p.rot += p.rotV;
      p.vx *= 0.99;

      if (frame > 100) p.alpha -= 0.018;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    }

    frame++;
    if (alive > 0) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(draw);
}
