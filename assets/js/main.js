/* ============================================================
   NLP4HC Workshop — JavaScript
   Handles: Nav, Scroll, Tabs, Back-to-Top, Contact Form
   ============================================================ */

'use strict';

/* ── Hamburger / Mobile Nav ─────────────────────────────── */
(function setupMobileNav() {
  const btn   = document.getElementById('hamburger-btn');
  const links = document.getElementById('nav-links-list');
  if (!btn || !links) return;

  btn.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
    btn.classList.toggle('open', isOpen);
  });

  // Close on link click
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      links.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.classList.remove('open');
    });
  });
})();

/* ── Active Nav Link on Scroll ──────────────────────────── */
(function setupScrollSpy() {
  const sections = document.querySelectorAll('section[id], div[id="stats"]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            link.classList.toggle(
              'active',
              link.getAttribute('href') === '#' + entry.target.id
            );
          });
        }
      });
    },
    { rootMargin: '-50% 0px -50% 0px' }
  );

  sections.forEach(s => observer.observe(s));
})();

/* ── Navbar Shadow on Scroll ────────────────────────────── */
(function setupNavbarScroll() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
    } else {
      navbar.style.boxShadow = 'none';
    }
  }, { passive: true });
})();

/* ── Back to Top Button ─────────────────────────────────── */
(function setupBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ── Organizer Tabs ─────────────────────────────────────── */
function switchTab(panelId) {
  // Hide all panels
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  // Deactivate all tab buttons
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

  // Activate target panel
  const panel = document.getElementById(panelId);
  if (panel) panel.classList.add('active');

  // Activate the clicked button (find via panelId mapping)
  const mapping = {
    'main-organizers': 'tab-organizers',
    'program-committee': 'tab-pc',
  };
  const tabId = mapping[panelId];
  if (tabId) {
    const tab = document.getElementById(tabId);
    if (tab) tab.classList.add('active');
  }
}

// Expose globally for onclick attributes
window.switchTab = switchTab;

/* ── Smooth Scroll for Anchor Links ─────────────────────── */
(function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ── Scroll Reveal Animation ────────────────────────────── */
(function setupScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.topic-card, .speaker-card, .organizer-card, .task-card, .highlight-item, .date-item, .stat-item, .submission-card, .contact-item'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, i * 60);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  revealElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(el);
  });
})();

/* ── Animated Counter for Stats ─────────────────────────── */
(function setupCounters() {
  const stats = document.querySelectorAll('.stat-number');

  const animateCounter = (el) => {
    const raw   = el.textContent.trim();
    const match = raw.match(/^(\d+)(.*)/);
    if (!match) return;

    const target = parseInt(match[1], 10);
    const suffix = match[2] || '';
    let current  = 0;
    const step   = Math.max(1, Math.floor(target / 40));
    const timer  = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current + suffix;
      if (current >= target) clearInterval(timer);
    }, 40);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach(s => observer.observe(s));
})();

/* ── Contact Form Handler ───────────────────────────────── */
function handleContactForm(event) {
  event.preventDefault();

  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success-msg');
  const btn     = document.getElementById('contact-submit-btn');

  if (!form) return;

  // Basic validation
  const name    = document.getElementById('contact-name').value.trim();
  const email   = document.getElementById('contact-email').value.trim();
  const subject = document.getElementById('contact-subject').value;
  const message = document.getElementById('contact-message').value.trim();

  if (!name || !email || !subject || !message) {
    alert('Please fill in all required fields.');
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  // Simulate submission (replace with real API/mailto when ready)
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    form.style.display = 'none';
    if (success) success.style.display = 'block';
  }, 1000);
}

window.handleContactForm = handleContactForm;

/* ── Hamburger Animation CSS ────────────────────────────── */
(function addHamburgerStyles() {
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  `;
  document.head.appendChild(style);
})();

console.log('%c NLP4HC Workshop Website loaded ✅', 'color: #1dd4ce; font-weight: bold; font-size: 14px;');
