(() => {
  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: .12 });
    revealItems.forEach(el => observer.observe(el));
  } else revealItems.forEach(el => el.classList.add('visible'));

  const officialPhoto = document.querySelector('[data-official-photo]');
  if (officialPhoto && matchMedia('(hover: none), (pointer: coarse)').matches && 'IntersectionObserver' in window) {
    let photoZoomed = false;

    const photoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const ratio = entry.intersectionRatio;

        if (!photoZoomed && entry.isIntersecting && ratio >= .78) {
          photoZoomed = true;
          officialPhoto.classList.add('hovered');
        } else if (photoZoomed && (!entry.isIntersecting || ratio <= .58)) {
          photoZoomed = false;
          officialPhoto.classList.remove('hovered');
        }
      });
    }, {
      threshold: [0, .58, .78, 1],
      rootMargin: '-10% 0px -10% 0px'
    });
    photoObserver.observe(officialPhoto);
  }

  const sandbox = document.querySelector('[data-sandbox]');
  if (sandbox) {
    const pieces = [...sandbox.querySelectorAll('[data-draggable]')];
    const portal = sandbox.querySelector('.sand-label');
    const creatureOrder = ['unicorn', 'shark', 'elephant'];
    const creatureNames = { unicorn: 'Unicorn', shark: 'Shark', elephant: 'Elephant' };
    const palette = {
      pink: '#e85d75',
      orange: '#ef8a3d',
      yellow: '#e8b84f',
      green: '#9fbd3b',
      purple: '#8b4b8f',
      ink: '#151515',
      paper: '#f2eee1'
    };

    const creatureSVG = {
      unicorn: `
        <svg viewBox="0 0 420 300" role="img" aria-label="Rainbow unicorn made from the play pieces">
          <g>
            <ellipse class="c-piece" cx="178" cy="176" rx="104" ry="58" fill="${palette.orange}"/>
            <path class="c-piece" d="M225 170 C250 151 252 116 267 92 C279 73 305 68 330 83 C348 94 351 116 337 131 C322 148 294 145 276 137 C265 150 254 174 244 194 Z" fill="${palette.pink}"/>
            <path class="c-piece" d="M278 76 L292 29 L307 78 Z" fill="${palette.yellow}"/>
            <path class="c-piece" d="M255 93 C242 78 240 60 250 48 C261 59 268 69 269 84 C259 75 250 70 240 69 C244 83 246 91 245 104 Z M250 109 C235 104 225 95 218 82 C215 98 220 113 236 126 Z" fill="${palette.purple}"/>
            <path class="c-piece" d="M86 173 C50 156 31 163 17 181 C40 184 58 194 77 211 C89 202 97 189 102 176 Z" fill="${palette.green}"/>
            <path class="c-piece" d="M110 214 L137 214 L133 272 L105 272 Z M201 214 L229 214 L236 272 L207 272 Z" fill="${palette.yellow}"/>
            <circle cx="318" cy="101" r="5.5" fill="${palette.ink}"/>
            <path d="M332 119 Q342 123 350 118" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round"/>
          </g>
        </svg>`,
      shark: `
        <svg viewBox="0 0 440 290" role="img" aria-label="Rainbow shark made from the play pieces">
          <g>
            <path class="c-piece" d="M72 150 C118 96 219 77 321 112 C353 122 374 141 385 151 C367 171 344 188 312 199 C211 230 117 206 72 164 C60 153 60 152 72 150 Z" fill="${palette.pink}"/>
            <path class="c-piece" d="M313 112 C350 79 381 63 420 65 C403 93 392 121 390 151 C399 178 410 201 424 222 C385 222 352 207 313 199 C335 176 338 137 313 112 Z" fill="${palette.orange}"/>
            <path class="c-piece" d="M196 100 C213 57 240 36 267 29 C261 61 262 85 278 112 Z" fill="${palette.purple}"/>
            <path class="c-piece" d="M192 205 C219 223 246 242 253 265 C225 258 197 242 169 211 Z" fill="${palette.green}"/>
            <path class="c-piece" d="M84 165 C146 177 240 178 328 151 C299 204 215 225 130 199 C109 192 92 180 84 165 Z" fill="${palette.yellow}"/>
            <circle cx="105" cy="142" r="6" fill="${palette.ink}"/>
            <path d="M91 164 Q107 175 125 166" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round"/>
            <path d="M145 139 L149 158 M158 136 L162 156 M171 134 L175 153" stroke="${palette.paper}" stroke-width="4" stroke-linecap="round"/>
          </g>
        </svg>`,
      elephant: `
        <svg viewBox="0 0 430 310" role="img" aria-label="Rainbow elephant made from the play pieces">
          <g>
            <ellipse class="c-piece" cx="187" cy="174" rx="113" ry="76" fill="${palette.orange}"/>
            <circle class="c-piece" cx="302" cy="146" r="67" fill="${palette.green}"/>
            <path class="c-piece" d="M285 126 C252 91 243 62 258 40 C284 51 307 74 318 107 C307 112 296 118 285 126 Z" fill="${palette.pink}"/>
            <path class="c-piece" d="M337 150 C364 164 370 192 359 219 C350 241 333 257 318 267 C312 256 313 244 324 233 C338 219 342 197 331 180 C326 172 322 165 321 158 Z" fill="${palette.purple}"/>
            <path class="c-piece" d="M86 173 C58 151 38 151 20 168 C42 175 58 190 73 209 C88 199 95 185 99 174 Z" fill="${palette.yellow}"/>
            <path class="c-piece" d="M110 224 L145 224 L142 284 L107 284 Z M204 224 L240 224 L245 284 L209 284 Z" fill="${palette.yellow}"/>
            <circle cx="322" cy="132" r="5.5" fill="${palette.ink}"/>
            <path d="M337 153 Q347 158 355 151" fill="none" stroke="${palette.ink}" stroke-width="4" stroke-linecap="round"/>
          </g>
        </svg>`
    };

    const creatureStage = document.createElement('div');
    creatureStage.className = 'play-creature';
    creatureStage.setAttribute('aria-live', 'polite');
    sandbox.appendChild(creatureStage);

    let currentCreatureIndex = 0;
    let transformed = 0;
    let resetting = false;
    let roundComplete = false;

    const setPortal = (label, message) => {
      if (!portal) return;
      portal.dataset.label = label;
      portal.dataset.message = message;
    };

    const openingState = () => setPortal('MELTING POT', 'drag all five pieces into the center');
    openingState();

    if (portal) {
      portal.setAttribute('aria-label', 'Melting pot');
      portal.removeAttribute('role');
      portal.removeAttribute('tabindex');
    }

    const inPortal = piece => {
      if (!portal) return false;
      const pr = piece.getBoundingClientRect();
      const rr = portal.getBoundingClientRect();
      const px = pr.left + pr.width / 2;
      const py = pr.top + pr.height / 2;
      const cx = rr.left + rr.width / 2;
      const cy = rr.top + rr.height / 2;
      const rx = rr.width * .58;
      const ry = rr.height * .58;
      const dx = (px - cx) / rx;
      const dy = (py - cy) / ry;
      return (dx * dx + dy * dy) <= 1;
    };

    const resetAfterCreature = () => {
      if (resetting) return;
      resetting = true;
      roundComplete = false;

      creatureStage.classList.add('escaping');

      setTimeout(() => {
        creatureStage.innerHTML = '';
        creatureStage.className = 'play-creature';
        currentCreatureIndex = (currentCreatureIndex + 1) % creatureOrder.length;
        transformed = 0;
        restorePieces();
        sandbox.classList.remove('complete', 'completing', 'portal-ready', 'portal-flash', 'resetting');
        openingState();

        setTimeout(() => {
          resetting = false;
        }, pieces.length * 90 + 260);
      }, 1450);
    };

    const showCreature = () => {
      const type = creatureOrder[currentCreatureIndex];
      creatureStage.innerHTML = creatureSVG[type];
      creatureStage.dataset.creature = type;
      creatureStage.setAttribute('aria-label', creatureNames[type]);
      sandbox.classList.remove('completing', 'portal-flash');
      roundComplete = true;
      openingState();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          creatureStage.classList.add('visible');
          setTimeout(resetAfterCreature, 900);
        });
      });
    };

    const finishRound = () => {
      roundComplete = false;
      sandbox.classList.add('completing', 'portal-flash');
      setTimeout(showCreature, 720);
    };

    const absorb = piece => {
      if (piece.classList.contains('consumed') || roundComplete || resetting) return;
      transformed += 1;
      piece.classList.add('consumed');
      sandbox.classList.remove('portal-ready');
      sandbox.classList.add('portal-flash');
      setTimeout(() => sandbox.classList.remove('portal-flash'), 620);

      if (transformed === pieces.length) {
        finishRound();
      } else if (transformed === pieces.length - 1) {
        setPortal('MELTING POT', 'one more piece...');
      } else {
        setPortal('MELTING POT', `${transformed} of ${pieces.length} pieces are melting`);
      }
    };

    const restorePieces = () => {
      pieces.forEach((piece, index) => {
        setTimeout(() => {
          piece.classList.remove('consumed');
          piece.removeAttribute('style');
          piece.classList.add('reborn');
          setTimeout(() => piece.classList.remove('reborn'), 760);
        }, index * 90);
      });
    };


    pieces.forEach(piece => {
      let drag = null;

      piece.addEventListener('pointerdown', e => {
        if (piece.classList.contains('consumed') || roundComplete || resetting) return;
        e.preventDefault();
        const pr = piece.getBoundingClientRect();
        drag = { id: e.pointerId, ox: e.clientX - pr.left, oy: e.clientY - pr.top };
        try { piece.setPointerCapture(e.pointerId); } catch (_) {}
        piece.style.zIndex = 30;
        piece.style.transform = 'rotate(0deg)';
      });

      piece.addEventListener('pointermove', e => {
        if (!drag || e.pointerId !== drag.id) return;
        const sr = sandbox.getBoundingClientRect();
        const w = piece.offsetWidth;
        const h = piece.offsetHeight;
        const x = Math.max(0, Math.min(sr.width - w, e.clientX - sr.left - drag.ox));
        const y = Math.max(0, Math.min(sr.height - h, e.clientY - sr.top - drag.oy));
        piece.style.left = `${x}px`;
        piece.style.top = `${y}px`;
        piece.style.right = 'auto';
        piece.style.bottom = 'auto';

        const ready = inPortal(piece);
        sandbox.classList.toggle('portal-ready', ready);
        if (ready) setPortal('LET GO', 'release to melt this piece');
        else if (transformed === 0) openingState();
        else if (transformed === pieces.length - 1) setPortal('MELTING POT', 'one more piece...');
        else setPortal('MELTING POT', `${transformed} of ${pieces.length} pieces are melting`);
      });

      const end = (e, cancelled = false) => {
        if (!drag || e.pointerId !== drag.id) return;
        try { piece.releasePointerCapture(e.pointerId); } catch (_) {}
        const shouldAbsorb = !cancelled && inPortal(piece);
        piece.style.zIndex = 3;
        drag = null;

        if (shouldAbsorb) absorb(piece);
        else {
          sandbox.classList.remove('portal-ready');
          if (transformed === 0) openingState();
          else if (transformed === pieces.length - 1) setPortal('MELTING POT', 'one more piece...');
          else setPortal('MELTING POT', `${transformed} of ${pieces.length} pieces are melting`);
        }
      };

      piece.addEventListener('pointerup', e => end(e, false));
      piece.addEventListener('pointercancel', e => end(e, true));

      piece.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        if (piece.classList.contains('consumed') || roundComplete || resetting) return;
        e.preventDefault();
        absorb(piece);
      });
    });
  }

  const board = document.querySelector('[data-journey-board]');
  const blocks = board ? [...board.querySelectorAll('[data-journey-block]')] : [];
  const COLS = 4, ROWS = 2;
  let metrics = null, active = null;

  const measure = () => {
    if (!board) return;
    const gap = parseFloat(getComputedStyle(board).getPropertyValue('--gap')) || 14;
    const w = board.clientWidth, h = board.clientHeight;
    metrics = { gap, w, h, cw: (w - gap * (COLS - 1)) / COLS, ch: (h - gap * (ROWS - 1)) / ROWS };
  };

  const pointFor = (c, r) => ({ x: c * (metrics.cw + metrics.gap), y: r * (metrics.ch + metrics.gap) });
  const occupied = (c, r, except) => blocks.some(b => b !== except && +b.dataset.col === c && +b.dataset.row === r);

  const nearestFree = (wantedC, wantedR, except) => {
    const free = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (!occupied(c, r, except)) free.push({ c, r, d: (c - wantedC) ** 2 + (r - wantedR) ** 2 });
      }
    }
    free.sort((a, b) => a.d - b.d);
    return free[0] || { c: +except.dataset.col, r: +except.dataset.row };
  };

  const place = (b, animate = true) => {
    if (!metrics) return;
    const { x, y } = pointFor(+b.dataset.col, +b.dataset.row);
    b.style.width = `${metrics.cw}px`;
    b.style.height = `${metrics.ch}px`;
    if (!animate) b.style.transition = 'none';
    b.style.left = `${x}px`;
    b.style.top = `${y}px`;
    if (!animate) requestAnimationFrame(() => b.style.transition = '');
  };

  const layout = () => {
    if (!board) return;
    measure();
    blocks.forEach(b => place(b, false));
  };

  blocks.forEach(b => {
    b.addEventListener('pointerdown', e => {
      if (!metrics) return;
      e.preventDefault();
      const br = b.getBoundingClientRect();
      active = { b, id: e.pointerId, ox: e.clientX - br.left, oy: e.clientY - br.top };
      try { b.setPointerCapture(e.pointerId); } catch (_) {}
      b.classList.add('dragging');
    });

    b.addEventListener('pointermove', e => {
      if (!active || active.b !== b || e.pointerId !== active.id) return;
      const rr = board.getBoundingClientRect();
      const x = Math.max(0, Math.min(metrics.w - metrics.cw, e.clientX - rr.left - active.ox));
      const y = Math.max(0, Math.min(metrics.h - metrics.ch, e.clientY - rr.top - active.oy));
      b.style.left = `${x}px`;
      b.style.top = `${y}px`;
    });

    const finish = (e, cancelled = false) => {
      if (!active || active.b !== b || e.pointerId !== active.id) return;
      try { b.releasePointerCapture(e.pointerId); } catch (_) {}

      if (cancelled) {
        b.classList.remove('dragging');
        active = null;
        place(b, true);
        return;
      }

      const x = parseFloat(b.style.left) || 0;
      const y = parseFloat(b.style.top) || 0;
      const wc = Math.max(0, Math.min(COLS - 1, Math.round(x / (metrics.cw + metrics.gap))));
      const wr = Math.max(0, Math.min(ROWS - 1, Math.round(y / (metrics.ch + metrics.gap))));
      const target = occupied(wc, wr, b) ? nearestFree(wc, wr, b) : { c: wc, r: wr };
      b.dataset.col = target.c;
      b.dataset.row = target.r;
      b.classList.remove('dragging');
      active = null;
      place(b, true);
    };

    b.addEventListener('pointerup', e => finish(e, false));
    b.addEventListener('pointercancel', e => finish(e, true));

    b.addEventListener('keydown', e => {
      const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };
      if (!dirs[e.key]) return;
      e.preventDefault();
      const [dc, dr] = dirs[e.key];
      const c = Math.max(0, Math.min(COLS - 1, +b.dataset.col + dc));
      const r = Math.max(0, Math.min(ROWS - 1, +b.dataset.row + dr));
      if (!occupied(c, r, b)) {
        b.dataset.col = c;
        b.dataset.row = r;
        place(b, true);
      }
    });
  });

  if (board) {
    layout();
    window.addEventListener('resize', layout, { passive: true });
  }
})();