/* ==========================================================================
   DIVA AI — Teaser Site Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initCurtain();
  initScrollAnimations();
  initQuoteCarousel();
  initStatCounters();
  initSignupForm();
});

/* --------------------------------------------------------------------------
   Curtain Reveal
   WHY: Creates a theatrical "stage curtain opening" effect on page load
   to match the diva performance theme
   -------------------------------------------------------------------------- */

function initCurtain() {
  const curtain = document.getElementById('curtain');
  if (!curtain) return;

  /* 1.2s delay lets the "The stage is set..." text be read before curtains open */
  setTimeout(() => {
    curtain.classList.add('open');
  }, 1200);

  /* Remove from DOM after animation completes to avoid blocking interaction */
  setTimeout(() => {
    curtain.classList.add('hidden');
  }, 2800);
}

/* --------------------------------------------------------------------------
   Scroll-triggered Animations
   WHY: Cards and elements animate in as user scrolls — keeps the page
   feeling alive like a performance unfolding
   -------------------------------------------------------------------------- */

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        /* Stagger cards by their data-delay attribute (0, 1, 2 = 0ms, 200ms, 400ms) */
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay * 200);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.legend-card').forEach(card => {
    observer.observe(card);
  });
}

/* --------------------------------------------------------------------------
   Quote Carousel
   WHY: Rotating diva quotes keep the personality front and center
   without requiring user interaction
   -------------------------------------------------------------------------- */

function initQuoteCarousel() {
  const cards = document.querySelectorAll('.quote-card');
  const dotsContainer = document.getElementById('quoteDots');
  if (!cards.length || !dotsContainer) return;

  let currentIndex = 0;

  // Build dot navigation
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.classList.add('quote-dot');
    dot.setAttribute('aria-label', `Quote ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToQuote(i));
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

  /* 5s interval — enough time to read each quote without feeling rushed */
  setInterval(() => {
    const next = (currentIndex + 1) % cards.length;
    goToQuote(next);
  }, 5000);
}

/* --------------------------------------------------------------------------
   Animated Stat Counters
   WHY: Numbers counting up creates a "reveal" moment — more impactful
   than static numbers for showing diva's results
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
  /* 2s duration for the count-up — long enough to feel dramatic */
  const duration = 2000;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    /* WHY: Ease-out curve makes the counting slow down as it approaches
       the target — feels more natural and builds anticipation */
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
   Signup Form
   WHY: Simple form handler — shows success state inline.
   No backend wired yet (teaser site), so we just show confirmation.
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
  });
}
