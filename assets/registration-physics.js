(() => {
  const container = document.querySelector('.registration-grid');
  if (!container) return;

  const helpStyleId = 'registration-help-v2-styles';
  if (!document.getElementById(helpStyleId)) {
    const style = document.createElement('style');
    style.id = helpStyleId;
    style.textContent = `
      .registration-help{
        position:relative;
        z-index:6;
        flex:0 0 auto;
        width:min(100%,780px);
        margin:clamp(22px,3.2vw,38px) auto 0;
        padding:4px;
        border-radius:30px;
        background:linear-gradient(90deg,#e85d75 0 20%,#ef8a3d 20% 40%,#e8b84f 40% 60%,#9fbd3b 60% 80%,#4aa6b5 80% 100%);
        box-shadow:0 16px 32px rgba(50,38,20,.14),0 5px 0 rgba(21,21,21,.12);
        transform:rotate(-.35deg);
        opacity:1!important;
      }
      .registration-help__inner{
        position:relative;
        display:grid;
        grid-template-columns:auto minmax(0,1fr) auto;
        align-items:center;
        gap:18px;
        padding:18px 20px;
        border-radius:25px;
        background:rgba(248,244,232,.96);
        overflow:hidden;
      }
      .registration-help__inner::before,
      .registration-help__inner::after{
        content:'';
        position:absolute;
        border-radius:999px;
        pointer-events:none;
      }
      .registration-help__inner::before{
        width:90px;height:90px;left:-34px;top:-46px;background:rgba(232,93,117,.14);
      }
      .registration-help__inner::after{
        width:110px;height:110px;right:-48px;bottom:-62px;background:rgba(74,166,181,.14);
      }
      .registration-help__ask{
        position:relative;
        z-index:1;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:88px;
        min-height:54px;
        padding:0 18px;
        border-radius:16px;
        background:#151515;
        color:#fff;
        font-weight:900;
        font-size:1rem;
        letter-spacing:.09em;
        box-shadow:0 6px 0 rgba(21,21,21,.14);
        transform:rotate(-3deg);
      }
      .registration-help__copy{
        position:relative;
        z-index:1;
        min-width:0;
      }
      .registration-help__kicker{
        margin:0 0 3px;
        color:#8b4b8f;
        font-size:.78rem;
        line-height:1;
        font-weight:900;
        letter-spacing:.1em;
        text-transform:uppercase;
      }
      .registration-help__title{
        margin:0;
        color:#151515;
        font-size:clamp(1.05rem,1.75vw,1.42rem);
        line-height:1.16;
        font-weight:850;
        letter-spacing:-.025em;
        text-wrap:balance;
      }
      .registration-help__email{
        position:relative;
        z-index:1;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-height:50px;
        max-width:100%;
        padding:0 17px;
        border-radius:15px;
        background:#4aa6b5;
        color:#fff;
        text-decoration:none;
        font-weight:850;
        font-size:.9rem;
        line-height:1.15;
        white-space:nowrap;
        box-shadow:0 6px 0 rgba(51,116,128,.25);
        transition:transform .18s ease,background .18s ease,box-shadow .18s ease;
      }
      .registration-help__email:hover,
      .registration-help__email:focus-visible{
        background:#ef8a3d;
        transform:translateY(-2px) rotate(1deg);
        box-shadow:0 8px 0 rgba(169,91,37,.18);
        outline:none;
      }
      @media (max-width:760px){
        .registration-section.screen{
          min-height:auto;
          overflow:visible;
        }
        .registration-inner{
          min-height:auto!important;
          overflow:visible;
          padding-bottom:18px!important;
        }
        .registration-grid{
          overflow:visible;
        }
        .registration-help{
          width:100%;
          margin-top:16px;
          border-radius:23px;
          transform:none;
          box-shadow:0 12px 24px rgba(50,38,20,.12),0 4px 0 rgba(21,21,21,.1);
        }
        .registration-help__inner{
          grid-template-columns:1fr;
          gap:11px;
          padding:15px;
          border-radius:19px;
          text-align:center;
        }
        .registration-help__ask{
          justify-self:center;
          min-height:42px;
          min-width:78px;
          padding:0 14px;
          border-radius:13px;
          font-size:.88rem;
          transform:rotate(-2deg);
        }
        .registration-help__kicker{
          font-size:.7rem;
        }
        .registration-help__title{
          font-size:clamp(1rem,4.7vw,1.2rem);
          line-height:1.15;
        }
        .registration-help__email{
          width:100%;
          min-height:46px;
          padding:0 12px;
          border-radius:13px;
          font-size:clamp(.78rem,3.7vw,.94rem);
          white-space:normal;
          overflow-wrap:anywhere;
          word-break:break-word;
        }
      }
    `;
    document.head.appendChild(style);
  }

  const registrationInner = container.closest('.registration-inner');
  if (registrationInner && !registrationInner.querySelector('.registration-help')) {
    const help = document.createElement('aside');
    help.className = 'registration-help';
    help.setAttribute('aria-label', 'Course questions and registration help');
    help.innerHTML = `
      <div class="registration-help__inner">
        <span class="registration-help__ask" aria-hidden="true">ASK</span>
        <div class="registration-help__copy">
          <p class="registration-help__kicker">Need a hand?</p>
          <p class="registration-help__title">Any questions about the course or problems signing up?</p>
        </div>
        <a class="registration-help__email" href="mailto:daniil.pokidko@hanken.fi">daniil.pokidko@hanken.fi</a>
      </div>`;
    container.insertAdjacentElement('afterend', help);
  }

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
