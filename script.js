/* ==========================================================================
   DIVA AI — Teaser Site Scripts (WILD EDITION)
   Full theatrical experience: sparkles, spotlight, confetti, runway walks
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCurtain();
  initSparkleCanvas();
  initMouseSpotlight();
  initHeroReveal();
  initScrollReveals();
  initTimelineAnimation();
  initRunwayAnimation();
  initQuoteCarousel();
  initStatCounters();
  initSignupForm();
});

/* --------------------------------------------------------------------------
   Curtain Reveal — Extended Theatrical Intro
   WHY: Longer build-up with text fade-ins creates anticipation
   before the "curtains open" on the main page
   -------------------------------------------------------------------------- */

function initCurtain() {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;

  /* 2.5s lets all three curtain text lines animate in before opening */
  setTimeout(() => {
    curtain.classList.add('open');
  }, 2500);

  setTimeout(() => {
    curtain.classList.add('hidden');
  }, 4200);
}

/* --------------------------------------------------------------------------
   Sparkle / Glitter Particle Canvas
   WHY: Persistent subtle glitter particles floating across the page
   give the entire site a glamorous, diva-worthy shimmer
   -------------------------------------------------------------------------- */

function initSparkleCanvas() {
  const canvas = document.getElementById('sparkleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  /* 40 particles balances visual impact against performance */
  const PARTICLE_COUNT = 40;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resize();
  window.addEventListener('resize', resize);

  class Sparkle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = Math.random() * -0.5 - 0.1;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.fadeSpeed = Math.random() * 0.008 + 0.003;
      this.growing = Math.random() > 0.5;
      /* WHY: Gold and white sparkles match the brand palette */
      this.color = Math.random() > 0.6
        ? `rgba(255, 215, 0, ${this.opacity})`
        : `rgba(255, 255, 255, ${this.opacity})`;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.growing) {
        this.opacity += this.fadeSpeed;
        if (this.opacity >= 0.7) this.growing = false;
      } else {
        this.opacity -= this.fadeSpeed;
        if (this.opacity <= 0) this.reset();
      }

      if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
        this.reset();
        this.y = canvas.height + 10;
      }
    }

    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;

      /* WHY: 4-point star shape instead of circle — more sparkle/glitter feel */
      ctx.beginPath();
      const s = this.size;
      ctx.moveTo(this.x, this.y - s);
      ctx.lineTo(this.x + s * 0.3, this.y - s * 0.3);
      ctx.lineTo(this.x + s, this.y);
      ctx.lineTo(this.x + s * 0.3, this.y + s * 0.3);
      ctx.lineTo(this.x, this.y + s);
      ctx.lineTo(this.x - s * 0.3, this.y + s * 0.3);
      ctx.lineTo(this.x - s, this.y);
      ctx.lineTo(this.x - s * 0.3, this.y - s * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Sparkle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   Mouse-Following Spotlight
   WHY: Creates the feeling that a stage spotlight follows the user's
   cursor — the user IS the star
   -------------------------------------------------------------------------- */

function initMouseSpotlight() {
  const spotlight = document.getElementById('mouseSpotlight');
  if (!spotlight) return;

  let mouseX = 0, mouseY = 0;
  let spotX = 0, spotY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    spotlight.classList.add('active');
  });

  document.addEventListener('mouseleave', () => {
    spotlight.classList.remove('active');
  });

  function updateSpotlight() {
    /* WHY: Lerp (0.08) creates smooth, "floaty" spotlight movement
       rather than snapping directly to cursor position */
    spotX += (mouseX - spotX) * 0.08;
    spotY += (mouseY - spotY) * 0.08;
    spotlight.style.left = spotX + 'px';
    spotlight.style.top = spotY + 'px';
    requestAnimationFrame(updateSpotlight);
  }

  updateSpotlight();
}

/* --------------------------------------------------------------------------
   Hero Content Staggered Reveal
   WHY: Each element in the hero fades in one after another, like
   acts in a show — builds dramatic tension
   -------------------------------------------------------------------------- */

function initHeroReveal() {
  const elements = document.querySelectorAll('.hero-content [data-reveal]');
  /* 3s initial delay lets the curtain finish opening first */
  const baseDelay = 3000;

  elements.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add('revealed');
    }, baseDelay + (i * 300));
  });
}

/* --------------------------------------------------------------------------
   Scroll-Triggered Reveals
   WHY: Elements throughout the page animate in as the user scrolls,
   keeping the performance feeling alive and unfolding
   -------------------------------------------------------------------------- */

function initScrollReveals() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        /* Stagger children if they have data-delay */
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay * 200);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  document.querySelectorAll('[data-scroll-reveal]').forEach(el => {
    observer.observe(el);
  });
}

/* --------------------------------------------------------------------------
   Timeline Animation
   WHY: The vertical timeline line "draws" itself as the user scrolls
   into the section, reinforcing the narrative "acts" of DIVA's story
   -------------------------------------------------------------------------- */

function initTimelineAnimation() {
  const timeline = document.querySelector('.timeline');
  const line = document.getElementById('timelineLine');
  if (!timeline || !line) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        line.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(timeline);

  /* Also observe individual timeline items */
  const itemObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        itemObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -80px 0px'
  });

  document.querySelectorAll('.timeline-item').forEach(item => {
    itemObserver.observe(item);
  });
}

/* --------------------------------------------------------------------------
   Runway / Diva Walk Animation
   WHY: The diva silhouette "walks in" from the left when scrolled into
   view — a literal runway entrance
   -------------------------------------------------------------------------- */

function initRunwayAnimation() {
  const silhouette = document.getElementById('divaSilhouette');
  const quote = document.querySelector('.runway-quote');
  if (!silhouette) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        silhouette.classList.add('visible');
        if (quote) {
          setTimeout(() => quote.classList.add('revealed'), 600);
        }
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(silhouette);
}

/* --------------------------------------------------------------------------
   Quote Carousel — Auto-rotating with dots
   WHY: Rotating diva quotes keep personality front and center
   -------------------------------------------------------------------------- */

function initQuoteCarousel() {
  const cards = document.querySelectorAll('.quote-card');
  const dotsContainer = document.getElementById('quoteDots');
  if (!cards.length || !dotsContainer) return;

  let currentIndex = 0;
  let interval;

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('quote-dot');
    dot.setAttribute('aria-label', `Quote ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToQuote(i);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  const dots = dotsContainer.querySelectorAll('.quote-dot');

  function goToQuote(index) {
    cards[currentIndex].classList.remove('active');
    dots[currentIndex].classList.remove('active');
    currentIndex = index;
    cards[currentIndex].classList.add('active');
    dots[currentIndex].classList.add('active');
  }

  function resetInterval() {
    clearInterval(interval);
    startInterval();
  }

  function startInterval() {
    /* 4.5s — enough to read but keeps energy high */
    interval = setInterval(() => {
      const next = (currentIndex + 1) % cards.length;
      goToQuote(next);
    }, 4500);
  }

  startInterval();
}

/* --------------------------------------------------------------------------
   Animated Stat Counters
   WHY: Numbers counting up creates a dramatic reveal moment
   -------------------------------------------------------------------------- */

function initStatCounters() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => observer.observe(el));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target, 10);
  const duration = 2200;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    /* Ease-out cubic for dramatic deceleration at the end */
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);

    element.textContent = current.toLocaleString();

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* --------------------------------------------------------------------------
   Signup Form with Confetti Celebration
   WHY: When someone signs up, celebrate with a confetti burst —
   because joining the A-List deserves a party
   -------------------------------------------------------------------------- */

function initSignupForm() {
  const form = document.getElementById('signupForm');
  const success = document.getElementById('signupSuccess');
  if (!form || !success) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = form.querySelector('input[type="email"]').value;
    if (!email) return;

    // TODO: Wire to actual email collection service (Mailchimp, ConvertKit, etc.)
    console.log('Email signup:', email);

    form.hidden = true;
    success.hidden = false;

    launchConfetti();
  });
}

/* --------------------------------------------------------------------------
   Confetti Cannon
   WHY: A diva doesn't just get a "thank you" — she gets a celebration.
   Gold and blue confetti matching the brand palette.
   -------------------------------------------------------------------------- */

function launchConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = [];
  /* 150 pieces for a satisfying burst without being overwhelming */
  const CONFETTI_COUNT = 150;
  const colors = [
    '#FFD700', '#2D5BFF', '#FF2D8A', '#8B5CF6',
    '#FFF5CC', '#4F7AFF', '#FFFFFF', '#E6C200'
  ];

  for (let i = 0; i < CONFETTI_COUNT; i++) {
    confetti.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 300,
      y: canvas.height * 0.6,
      /* WHY: Negative speedY launches upward, gravity pulls back down */
      speedX: (Math.random() - 0.5) * 15,
      speedY: Math.random() * -18 - 5,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10,
      gravity: 0.25 + Math.random() * 0.15,
      opacity: 1,
      /* WHY: Different shapes (rect vs circle) make confetti look more natural */
      shape: Math.random() > 0.5 ? 'rect' : 'circle'
    });
  }

  let frame = 0;

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let activeCount = 0;

    confetti.forEach(c => {
      if (c.opacity <= 0) return;
      activeCount++;

      c.x += c.speedX;
      c.speedY += c.gravity;
      c.y += c.speedY;
      c.rotation += c.rotSpeed;
      c.speedX *= 0.99;

      /* Fade out after 2 seconds (120 frames at ~60fps) */
      if (frame > 120) {
        c.opacity -= 0.015;
      }

      ctx.save();
      ctx.translate(c.x, c.y);
      ctx.rotate((c.rotation * Math.PI) / 180);
      ctx.globalAlpha = Math.max(0, c.opacity);
      ctx.fillStyle = c.color;

      if (c.shape === 'rect') {
        ctx.fillRect(-c.size / 2, -c.size / 4, c.size, c.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, c.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    frame++;

    if (activeCount > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}
