// ===== Main JS (cleaned, no stray chars) =====
document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const themeToggle = document.querySelector('.theme-toggle');
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const htmlElement = document.documentElement;
  const themeIcon = themeToggle?.querySelector('i');

  // Theme handling (persistent)
  const THEME_KEY = 'theme-preference';
  function applyTheme(theme) {
    if (!theme) return;
    htmlElement.setAttribute('data-theme', theme);
    if (themeIcon) {
      themeIcon.classList.remove('fa-moon', 'fa-sun');
      themeIcon.classList.add(theme === 'light' ? 'fa-sun' : 'fa-moon');
    }
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
  }
  let saved = localStorage.getItem(THEME_KEY);
  if (!saved) {
    saved = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  applyTheme(saved);
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = htmlElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      localStorage.setItem(THEME_KEY, next);
    });
    themeToggle.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        themeToggle.click();
      }
    });
  }

  // Mobile nav toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navToggle.querySelector('i')?.classList.toggle('fa-times');
    });
  }

  // Smooth scrolling for internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') { e.preventDefault(); return; }
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // if mobile menu open, close it
        if (navMenu?.classList.contains('open')) {
          navMenu.classList.remove('open');
          navToggle?.setAttribute('aria-expanded', 'false');
          navToggle?.querySelector('i')?.classList.remove('fa-times');
        }
      }
    });
  });

  // Active nav highlighting (throttled)
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  function highlightNavigation() {
    const scrollPosition = window.scrollY + 110;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }
  function throttle(fn, delay) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last < delay) return;
      last = now;
      return fn(...args);
    };
  }
  window.addEventListener('scroll', throttle(highlightNavigation, 120));

  // Year stamp
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  // Intersection observer animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.section-inner, .project-card, .skill-card, .certification-item, .education-item, .experience-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

  // Navbar shadow on scroll
  const navbar = document.querySelector('header');
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (y > 80) {
      navbar.style.boxShadow = '0 6px 18px var(--shadow)';
    } else {
      navbar.style.boxShadow = '0 2px 10px var(--shadow)';
    }
  }, { passive: true });

  // Skill card hover (JS fallback)
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.style.transform = 'translateY(-6px) scale(1.03)');
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });

  // Loading fade-in
  window.requestAnimationFrame(() => {
    document.body.style.opacity = '1';
    document.body.style.transition = 'opacity 0.45s ease';
  });
}); // DOMContentLoaded end