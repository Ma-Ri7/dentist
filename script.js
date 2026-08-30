/* =========================================================
   BrightSmile Dental — Premium Interactions
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Dynamic year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const closeMenu = () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  };
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('.nav-link').forEach((l) => l.addEventListener('click', closeMenu));
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !hamburger.contains(e.target)) closeMenu();
    });
  }

  /* ---------- Navbar + scroll progress ---------- */
  const navbar = document.getElementById('navbar');
  const scrollTopBtn = document.getElementById('scrollTop');
  const progress = document.getElementById('scrollProgress');
  let docH = 0;

  const onScroll = () => {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 30);
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 500);
    if (progress && docH > 0) {
      const max = docH - window.innerHeight;
      progress.style.width = `${Math.min((y / max) * 100, 100)}%`;
    }
  };
  const setDraw = () => { docH = document.documentElement.scrollHeight; onScroll(); };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', setDraw, { passive: true });
  setDraw();

  /* ---------- Active nav link ---------- */
  const navLinksAll = document.querySelectorAll('.nav-link');
  const sections = [...navLinksAll].map((l) => document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const highlight = () => {
    const pos = window.scrollY + 120;
    let cur = sections[0];
    for (const s of sections) if (s.offsetTop <= pos) cur = s;
    navLinksAll.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${cur.id}`));
  };
  window.addEventListener('scroll', highlight, { passive: true });
  highlight();

  /* ---------- Animated counters ---------- */
  const animateCount = (el) => {
    if (prefersReduced) return;
    const target = parseFloat(el.dataset.count || el.textContent.replace(/[^\d.]/g, '')) || 0;
    const suffix = el.dataset.suffix || '';
    const dur = 1600;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  /* ---------- Scroll reveal (with stagger) ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add('visible');
        observer.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach((el) => observer.observe(el));

    // stagger cards that share a common grid parent
    const grids = document.querySelectorAll('.services-grid, .team-grid, .testi-grid');
    grids.forEach((grid) => {
      [...grid.children].forEach((kid, i) => {
        kid.style.transitionDelay = `${i * 110}ms`;
        observer.observe(kid);
      });
    });
  } else {
    revealEls.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Counters trigger ---------- */
  const countEls = document.querySelectorAll('[data-count]');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    countEls.forEach((el) => co.observe(el));
  } else {
    countEls.forEach((el) => (el.textContent = el.dataset.count + (el.dataset.suffix || '')));
  }

  /* ---------- Hero 3D tilt (desktop) ---------- */
  const tilt = document.querySelector('.hero-img-wrap');
  if (tilt && window.matchMedia('(hover: hover)').matches && window.matchMedia('(min-width: 1025px)').matches && !prefersReduced) {
    const onMove = (e) => {
      const r = tilt.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${py * -7}deg)`;
    };
    const onLeave = () => (tilt.style.transform = '');
    tilt.addEventListener('mousemove', onMove);
    tilt.addEventListener('mouseleave', onLeave);
  }

  /* ---------- Appointment form ---------- */
  const form = document.getElementById('appointmentForm');
  const formNote = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const date = document.getElementById('date').value;
      if (!name || !date) {
        formNote.textContent = 'Please fill in your name and a preferred date.';
        formNote.style.color = '#e5484d';
        return;
      }
      formNote.textContent =
        `Thank you, ${name.split(' ')[0]}! Your request${date ? ' for ' + date : ''} has been received. Our team will contact you shortly.`;
      formNote.style.color = '#0b8f83';
      form.reset();
    });
  }
});

