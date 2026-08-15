(() => {
  const container = document.querySelector('.registration-grid');
  if (!container) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const blocks = [...container.querySelectorAll('.registration-block')];
  if (!blocks.length) return;

  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    runPhysics(container, blocks);
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          start();
          io.disconnect();
        }
      });
    }, { threshold: .2 });
    io.observe(container);
  } else {
    start();
  }

  function runPhysics(container, elements) {
    const W = container.getBoundingClientRect().width;
    if (!W || !isFinite(W)) return;

    const brickW = Math.min(180, Math.max(118, W * 0.22));
    const brickH = Math.round(brickW * 0.5);
    const arenaH = Math.max(340, brickH * 4.2);

    container.classList.add('physics-active');
    container.style.height = arenaH + 'px';

    const GRAVITY = 2400;
    const RESTITUTION = 0.22;
    const FRICTION = 0.8;
    const AIR_DRAG = 0.999;
    const SLEEP_V = 6;
    const SLEEP_OMEGA = 4;
    const MAX_RUNTIME = 7000;

    const bodies = elements.map((el, i) => {
      el.style.width = brickW + 'px';
      el.style.height = brickH + 'px';
      el.style.left = '0px';
      el.style.top = '0px';

      const x = brickW / 2 + Math.random() * Math.max(0, W - brickW);
      const y = -brickH / 2 - i * (brickH * 1.5) - Math.random() * 40;

      return {
        el,
        w: brickW,
        h: brickH,
        x, y,
        vx: (Math.random() - 0.5) * 40,
        vy: 0,
        angle: (Math.random() - 0.5) * 10,
        omega: (Math.random() - 0.5) * 30,
        landed: false,
        asleep: false,
      };
    });

    let last = null;
    const startTime = performance.now();

    const integrate = (b, dt) => {
      b.vy += GRAVITY * dt;
      b.vx *= AIR_DRAG;
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.angle += b.omega * dt;
    };

    const resolveWalls = b => {
      const half = b.w / 2;
      if (b.x - half < 0) { b.x = half; b.vx = Math.abs(b.vx) * FRICTION; }
      if (b.x + half > W) { b.x = W - half; b.vx = -Math.abs(b.vx) * FRICTION; }
    };

    const resolveFloor = b => {
      const half = b.h / 2;
      if (b.y + half > arenaH) {
        b.y = arenaH - half;
        b.vy = Math.abs(b.vy) > 40 ? -b.vy * RESTITUTION : 0;
        b.vx *= FRICTION;
        b.omega *= FRICTION;
        b.landed = true;
      }
    };

    const applySupportCheck = (top, bottom) => {
      const topLeft = top.x - top.w / 2, topRight = top.x + top.w / 2;
      const botLeft = bottom.x - bottom.w / 2, botRight = bottom.x + bottom.w / 2;
      const supported = Math.min(topRight, botRight) - Math.max(topLeft, botLeft);
      const supportRatio = Math.max(0, supported) / top.w;
      top.landed = true;
      if (supportRatio < 0.35 && !top.asleep) {
        const dir = (top.x - bottom.x) >= 0 ? 1 : -1;
        top.omega = dir * (130 + Math.random() * 50);
        top.vx = dir * 55;
      } else {
        top.omega *= FRICTION;
        top.vx *= FRICTION;
      }
    };

    const resolvePair = (a, c) => {
      if (a.asleep && c.asleep) return;

      const ax0 = a.x - a.w / 2, ax1 = a.x + a.w / 2, ay0 = a.y - a.h / 2, ay1 = a.y + a.h / 2;
      const cx0 = c.x - c.w / 2, cx1 = c.x + c.w / 2, cy0 = c.y - c.h / 2, cy1 = c.y + c.h / 2;
      const overlapX = Math.min(ax1, cx1) - Math.max(ax0, cx0);
      const overlapY = Math.min(ay1, cy1) - Math.max(ay0, cy0);
      if (overlapX <= 0 || overlapY <= 0) return;

      if (overlapX < overlapY) {
        const push = overlapX / 2;
        const dir = a.x < c.x ? -1 : 1;
        if (!a.asleep) { a.x += dir * push; a.vx = dir * Math.max(30, Math.abs(a.vx)); }
        if (!c.asleep) { c.x -= dir * push; c.vx = -dir * Math.max(30, Math.abs(c.vx)); }
      } else {
        const push = overlapY / 2;
        if (a.y < c.y) {
          if (!a.asleep) { a.y -= push; if (a.vy > 0) a.vy = 0; }
          if (!c.asleep) c.y += push;
          if (!a.asleep) applySupportCheck(a, c);
        } else {
          if (!c.asleep) { c.y -= push; if (c.vy > 0) c.vy = 0; }
          if (!a.asleep) a.y += push;
          if (!c.asleep) applySupportCheck(c, a);
        }
      }
    };

    const checkSleep = b => {
      if (!b.landed) return;
      if (Math.abs(b.vx) < SLEEP_V && Math.abs(b.vy) < SLEEP_V && Math.abs(b.omega) < SLEEP_OMEGA) {
        b.vx = 0; b.vy = 0; b.omega = 0;
        b.asleep = true;
      }
    };

    const forceSettle = b => {
      b.vx = 0; b.vy = 0; b.omega = 0; b.asleep = true;
      b.x = Math.min(Math.max(b.x, b.w / 2), W - b.w / 2);
      b.y = Math.min(b.y, arenaH - b.h / 2);
    };

    const render = () => {
      bodies.forEach(b => {
        if (!isFinite(b.x) || !isFinite(b.y) || !isFinite(b.angle)) {
          b.x = b.w / 2 + Math.random() * Math.max(0, W - b.w);
          b.y = arenaH - b.h / 2;
          b.angle = 0;
          forceSettle(b);
        }
        b.el.style.transform = `translate(${(b.x - b.w / 2).toFixed(1)}px, ${(b.y - b.h / 2).toFixed(1)}px) rotate(${b.angle.toFixed(1)}deg)`;
      });
    };

    const step = now => {
      if (last === null) last = now;
      const dt = Math.min((now - last) / 1000, 0.032);
      last = now;

      if (now - startTime > MAX_RUNTIME) {
        bodies.forEach(b => { if (!b.asleep) forceSettle(b); });
        render();
        return;
      }

      let anyAwake = false;
      bodies.forEach(b => {
        if (b.asleep) return;
        anyAwake = true;
        integrate(b, dt);
        resolveWalls(b);
        resolveFloor(b);
      });

      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          resolvePair(bodies[i], bodies[j]);
        }
      }

      bodies.forEach(b => { if (!b.asleep) checkSleep(b); });
      render();

      if (anyAwake) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }
})();
