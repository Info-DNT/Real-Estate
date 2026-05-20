/* devashribuilders — main interactions */

document.addEventListener('DOMContentLoaded', function () {
  // ===== AOS =====
  if (window.AOS) {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      delay: 0,
    });
  }

  // ===== Navbar shrink on scroll =====
  const nav = document.querySelector('.navbar-dvb');
  const progress = document.querySelector('.scroll-progress');
  const scrollTopBtn = document.querySelector('.scroll-top');

  function onScroll() {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 24);
    if (progress) {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = h > 0 ? ((y / h) * 100) + '%' : '0%';
    }
    if (scrollTopBtn) scrollTopBtn.classList.toggle('show', y > 500);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Hamburger / mobile drawer =====
  const hamburger = document.querySelector('.hamburger');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');

  function toggleDrawer(open) {
    if (!drawer) return;
    const willOpen = typeof open === 'boolean' ? open : !drawer.classList.contains('open');
    drawer.classList.toggle('open', willOpen);
    overlay && overlay.classList.toggle('open', willOpen);
    hamburger && hamburger.classList.toggle('open', willOpen);
    document.body.style.overflow = willOpen ? 'hidden' : '';
  }
  hamburger && hamburger.addEventListener('click', () => toggleDrawer());
  overlay && overlay.addEventListener('click', () => toggleDrawer(false));
  drawer && drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggleDrawer(false)));

  // ===== Scroll to top =====
  scrollTopBtn && scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ===== Reveal on scroll (fallback for non-AOS) =====
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((r) => io.observe(r));
  }

  // ===== Counter animation =====
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseFloat(el.getAttribute('data-counter'));
        const dur = 1800;
        const start = performance.now();
        const startVal = 0;
        const isFloat = target % 1 !== 0;
        function step(t) {
          const p = Math.min(1, (t - start) / dur);
          const ease = 1 - Math.pow(1 - p, 3);
          const val = startVal + (target - startVal) * ease;
          el.textContent = isFloat ? val.toFixed(1) : Math.floor(val).toLocaleString();
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString();
        }
        requestAnimationFrame(step);
        cio.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  }

  // ===== Project filters (projects.html) =====
  const projChips = document.querySelectorAll('[data-project-filter]');
  const projItems = document.querySelectorAll('[data-project-cat]');
  if (projChips.length && projItems.length) {
    projChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-project-filter');
        projChips.forEach((c) => c.classList.toggle('active', c === chip));
        projItems.forEach((item) => {
          const itemCat = item.getAttribute('data-project-cat');
          const show = cat === 'all' || itemCat === cat;
          item.style.display = show ? '' : 'none';
          if (show) {
            item.style.animation = 'none';
            // eslint-disable-next-line no-unused-expressions
            item.offsetHeight;
            item.style.animation = 'fade-up .6s cubic-bezier(.22,.61,.36,1) forwards';
            item.style.opacity = '0';
          }
        });
      });
    });
  }

  // ===== Gallery filters + lightbox =====
  const galleryChips = document.querySelectorAll('[data-gallery-filter]');
  const galleryItems = document.querySelectorAll('[data-gallery-cat]');
  if (galleryChips.length) {
    galleryChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        const cat = chip.getAttribute('data-gallery-filter');
        galleryChips.forEach((c) => c.classList.toggle('active', c === chip));
        galleryItems.forEach((item) => {
          const itemCat = item.getAttribute('data-gallery-cat');
          const show = cat === 'all' || itemCat === cat;
          item.style.display = show ? '' : 'none';
        });
      });
    });
  }

  // Lightbox
  const lb = document.getElementById('lightbox');
  if (lb && galleryItems.length) {
    const lbImg = lb.querySelector('img');
    const lbCap = lb.querySelector('.lightbox-caption');
    const lbClose = lb.querySelector('.lightbox-close');
    const lbPrev = lb.querySelector('.lightbox-prev');
    const lbNext = lb.querySelector('.lightbox-next');
    let curIdx = 0;
    const visibleItems = () => Array.from(galleryItems).filter((i) => i.style.display !== 'none');

    function open(idx) {
      const items = visibleItems();
      curIdx = (idx + items.length) % items.length;
      const item = items[curIdx];
      const img = item.querySelector('img');
      lbImg.src = img.getAttribute('data-full') || img.src;
      lbCap.textContent = img.alt || '';
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      lb.classList.remove('open');
      document.body.style.overflow = '';
    }

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => open(Array.from(visibleItems()).indexOf(item)));
    });
    lbClose && lbClose.addEventListener('click', close);
    lbPrev && lbPrev.addEventListener('click', () => open(curIdx - 1));
    lbNext && lbNext.addEventListener('click', () => open(curIdx + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') open(curIdx - 1);
      else if (e.key === 'ArrowRight') open(curIdx + 1);
    });
  }

  // ===== Blog search + filter =====
  const blogInput = document.getElementById('blog-search');
  const blogChips = document.querySelectorAll('[data-blog-filter]');
  const blogCards = document.querySelectorAll('[data-blog-card]');
  let curCat = 'all';
  let curQ = '';
  function applyBlog() {
    let visible = 0;
    blogCards.forEach((c) => {
      const cat = c.getAttribute('data-blog-cat');
      const text = c.textContent.toLowerCase();
      const matchesCat = curCat === 'all' || cat === curCat;
      const matchesQ = !curQ || text.includes(curQ);
      const show = matchesCat && matchesQ;
      c.style.display = show ? '' : 'none';
      if (show) visible++;
    });
    const empty = document.getElementById('blog-empty');
    if (empty) empty.style.display = visible === 0 ? 'block' : 'none';
  }
  blogInput && blogInput.addEventListener('input', (e) => { curQ = e.target.value.trim().toLowerCase(); applyBlog(); });
  blogChips.forEach((c) => c.addEventListener('click', () => {
    blogChips.forEach((x) => x.classList.toggle('active', x === c));
    curCat = c.getAttribute('data-blog-filter');
    applyBlog();
  }));

  // ===== Contact form validation =====
  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const fields = form.querySelectorAll('[data-required]');
      fields.forEach((f) => {
        const group = f.closest('.form-group');
        const v = f.value.trim();
        let valid = !!v;
        if (f.type === 'email' && valid) {
          valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        }
        if (f.type === 'tel' && valid) {
          valid = /^[+\d\s\-()]{8,}$/.test(v);
        }
        group.classList.toggle('invalid', !valid);
        if (!valid) ok = false;
      });
      if (ok) {
        const success = form.querySelector('.form-success');
        if (success) {
          success.classList.add('show');
          setTimeout(() => success.classList.remove('show'), 5000);
        }
        form.reset();
      }
    });
    form.querySelectorAll('[data-required]').forEach((f) => {
      f.addEventListener('input', () => f.closest('.form-group').classList.remove('invalid'));
    });
  }

  // ===== Newsletter mini-form =====
  const news = document.getElementById('newsletter-form');
  if (news) {
    news.addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = news.querySelector('input[type="email"]');
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(inp.value.trim());
      const msg = news.querySelector('.news-msg');
      if (ok) {
        if (msg) { msg.textContent = "Thanks — you'll hear from us soon."; msg.style.color = 'var(--emerald)'; }
        inp.value = '';
      } else if (msg) {
        msg.textContent = 'Please enter a valid email.'; msg.style.color = '#b91c1c';
      }
    });
  }

  // ===== Hero word-by-word split (already handled in HTML markup) =====

  // ===== Lazy image fade-in =====
  document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
    img.style.opacity = '0';
    img.style.transition = 'opacity .6s ease';
    if (img.complete) img.style.opacity = '1';
    else img.addEventListener('load', () => { img.style.opacity = '1'; });
  });
});
