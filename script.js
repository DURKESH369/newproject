// Theme handling
(function setupTheme() {
  const root = document.documentElement;
  const key = 'theme-preference';
  const stored = localStorage.getItem(key);
  // Default to dark as requested; user toggle still persists
  const initial = stored || 'dark';
  if (initial === 'dark') root.setAttribute('data-theme', 'dark');
  if (initial === 'light') root.setAttribute('data-theme', 'light');

  const btn = document.getElementById('themeToggle');
  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      localStorage.setItem(key, next);
    });
  }
})();

// Mobile nav toggle
(function setupNav() {
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  if (!toggle || !menu) return;
  const setExpanded = (expanded) => {
    toggle.setAttribute('aria-expanded', String(expanded));
    menu.setAttribute('aria-expanded', String(expanded));
  };
  toggle.addEventListener('click', () => {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    setExpanded(!isOpen);
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setExpanded(false)));
})();

// Copy email
(function setupCopyEmail() {
  const btn = document.getElementById('copyEmail');
  if (!btn) return;
  btn.addEventListener('click', async () => {
    const email = btn.getAttribute('data-email');
    if (!email) return;
    try {
      await navigator.clipboard.writeText(email);
      const prev = btn.textContent;
      btn.textContent = 'Copied!';
      setTimeout(() => (btn.textContent = prev), 1200);
    } catch (e) {
      // Best-effort fallback
      prompt('Copy email address:', email);
    }
  });
})();

// Year
document.getElementById('year').textContent = String(new Date().getFullYear());

// Scroll reveal
(function setupReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    elements.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
  );
  elements.forEach((el) => observer.observe(el));
})();

// Animated background particles
(function setupParticles() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(dpr, dpr);

  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = prefersReduced ? 0 : Math.floor((width * height) / 26000);
  const starCount = prefersReduced ? 0 : Math.floor((width * height) / 12000);

  const particles = [];
  const stars = [];
  const meteors = [];
  const colors = [
    'rgba(111,66,193,0.5)', // purple
    'rgba(79,140,255,0.5)', // blue
    'rgba(16,185,129,0.45)', // green
    'rgba(244,114,182,0.45)' // pink
  ];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.2,
      r: Math.random() * 2 + 0.5,
      c: colors[(Math.random() * colors.length) | 0]
    });
  }

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.2 + 0.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.5 + Math.random() * 1.5
    });
  }

  let meteorCooldown = 0;

  function draw(ts) {
    ctx.clearRect(0, 0, width, height);
    // twinkling stars
    for (let i = 0; i < stars.length; i++) {
      const st = stars[i];
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(st.phase + (ts || 0) * 0.001 * st.speed));
      ctx.fillStyle = 'rgba(255,255,255,' + alpha.toFixed(3) + ')';
      ctx.beginPath();
      ctx.arc(st.x, st.y, st.r, 0, Math.PI * 2);
      ctx.fill();
    }
    // subtle colorized network lines
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;
    }

    // draw connections
    const maxDist = 110;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i];
        const b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < maxDist * maxDist) {
          const alpha = 1 - d2 / (maxDist * maxDist);
          ctx.strokeStyle = 'rgba(106,168,255,' + (alpha * 0.12) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // shooting stars (meteors)
    if (!prefersReduced) {
      if (meteorCooldown <= 0 && Math.random() < 0.02) {
        const fromTop = Math.random() < 0.5;
        const startX = fromTop ? Math.random() * width * 0.6 : -50;
        const startY = fromTop ? -50 : Math.random() * height * 0.6;
        const speed = 3 + Math.random() * 2;
        const angle = Math.PI / 4 + Math.random() * 0.4; // ~45deg
        meteors.push({ x: startX, y: startY, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, life: 0, maxLife: 120 });
        meteorCooldown = 180 + (Math.random() * 240) | 0;
      } else {
        meteorCooldown--;
      }
      for (let i = meteors.length - 1; i >= 0; i--) {
        const m = meteors[i];
        m.x += m.vx;
        m.y += m.vy;
        m.life++;
        const trail = 10;
        for (let t = 0; t < trail; t++) {
          const k = t / trail;
          ctx.fillStyle = 'rgba(255,255,255,' + (0.15 * (1 - k)).toFixed(3) + ')';
          ctx.fillRect(m.x - m.vx * k * 2, m.y - m.vy * k * 2, 2, 2);
        }
        ctx.fillStyle = 'rgba(255,255,255,0.9)';
        ctx.beginPath();
        ctx.arc(m.x, m.y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        if (m.life > m.maxLife || m.x > width + 60 || m.y > height + 60) {
          meteors.splice(i, 1);
        }
      }
    }

    rafId = requestAnimationFrame(draw);
  }

  let rafId = requestAnimationFrame(draw);

  function onResize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  }
  window.addEventListener('resize', onResize);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(draw);
  });
})();


