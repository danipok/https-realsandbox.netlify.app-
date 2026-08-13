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
    const photoObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => officialPhoto.classList.toggle('hovered', entry.isIntersecting && entry.intersectionRatio > .72));
    }, { threshold: [.3, .72, .9], rootMargin: '-10% 0px -10% 0px' });
    photoObserver.observe(officialPhoto);
  }

  const sandbox = document.querySelector('[data-sandbox]');
  if (sandbox) {
    [...sandbox.querySelectorAll('[data-draggable]')].forEach(piece => {
      let drag = null;
      piece.addEventListener('pointerdown', e => {
        e.preventDefault();
        const pr = piece.getBoundingClientRect();
        drag = { id:e.pointerId, ox:e.clientX-pr.left, oy:e.clientY-pr.top };
        piece.setPointerCapture(e.pointerId);
        piece.style.zIndex = 30;
        piece.style.transform = 'rotate(0deg)';
      });
      piece.addEventListener('pointermove', e => {
        if (!drag || e.pointerId !== drag.id) return;
        const sr = sandbox.getBoundingClientRect();
        const w = piece.offsetWidth, h = piece.offsetHeight;
        const x = Math.max(0, Math.min(sr.width-w, e.clientX-sr.left-drag.ox));
        const y = Math.max(0, Math.min(sr.height-h, e.clientY-sr.top-drag.oy));
        piece.style.left = `${x}px`; piece.style.top = `${y}px`; piece.style.right='auto'; piece.style.bottom='auto';
      });
      const end = e => {
        if (!drag || e.pointerId !== drag.id) return;
        try { piece.releasePointerCapture(e.pointerId); } catch (_) {}
        piece.style.zIndex = 3; drag = null;
      };
      piece.addEventListener('pointerup', end); piece.addEventListener('pointercancel', end);
    });
  }

  const board = document.querySelector('[data-journey-board]');
  const blocks = board ? [...board.querySelectorAll('[data-journey-block]')] : [];
  const COLS = 5, ROWS = 3;
  let metrics = null, active = null;
  const measure = () => {
    if (!board) return;
    const gap = parseFloat(getComputedStyle(board).getPropertyValue('--gap')) || 14;
    const w = board.clientWidth, h = board.clientHeight;
    metrics = { gap, w, h, cw:(w-gap*(COLS-1))/COLS, ch:(h-gap*(ROWS-1))/ROWS };
  };
  const pointFor = (c,r) => ({ x:c*(metrics.cw+metrics.gap), y:r*(metrics.ch+metrics.gap) });
  const occupied = (c,r,except) => blocks.some(b => b!==except && +b.dataset.col===c && +b.dataset.row===r);
  const nearestFree = (wantedC,wantedR,except) => {
    const free=[];
    for(let r=0;r<ROWS;r++) for(let c=0;c<COLS;c++) if(!occupied(c,r,except)) free.push({c,r,d:(c-wantedC)**2+(r-wantedR)**2});
    free.sort((a,b)=>a.d-b.d); return free[0] || {c:+except.dataset.col,r:+except.dataset.row};
  };
  const place = (b, animate=true) => {
    if (!metrics) return;
    const {x,y}=pointFor(+b.dataset.col,+b.dataset.row);
    b.style.width=`${metrics.cw}px`; b.style.height=`${metrics.ch}px`;
    if(!animate)b.style.transition='none';
    b.style.left=`${x}px`; b.style.top=`${y}px`;
    if(!animate)requestAnimationFrame(()=>b.style.transition='');
  };
  const layout = () => { if(!board)return; measure(); blocks.forEach(b=>place(b,false)); };
  blocks.forEach(b => {
    b.addEventListener('pointerdown', e => {
      if(!metrics)return; e.preventDefault();
      const br=b.getBoundingClientRect();
      active={b,id:e.pointerId,ox:e.clientX-br.left,oy:e.clientY-br.top};
      b.setPointerCapture(e.pointerId); b.classList.add('dragging');
    });
    b.addEventListener('pointermove', e => {
      if(!active || active.b!==b || e.pointerId!==active.id)return;
      const rr=board.getBoundingClientRect();
      const x=Math.max(0,Math.min(metrics.w-metrics.cw,e.clientX-rr.left-active.ox));
      const y=Math.max(0,Math.min(metrics.h-metrics.ch,e.clientY-rr.top-active.oy));
      b.style.left=`${x}px`; b.style.top=`${y}px`;
    });
    const finish=e=>{
      if(!active || active.b!==b || e.pointerId!==active.id)return;
      try{b.releasePointerCapture(e.pointerId)}catch(_){ }
      const x=parseFloat(b.style.left)||0,y=parseFloat(b.style.top)||0;
      const wc=Math.max(0,Math.min(COLS-1,Math.round(x/(metrics.cw+metrics.gap))));
      const wr=Math.max(0,Math.min(ROWS-1,Math.round(y/(metrics.ch+metrics.gap))));
      const target=occupied(wc,wr,b)?nearestFree(wc,wr,b):{c:wc,r:wr};
      b.dataset.col=target.c; b.dataset.row=target.r; b.classList.remove('dragging'); active=null; place(b,true);
    };
    b.addEventListener('pointerup',finish); b.addEventListener('pointercancel',finish);
    b.addEventListener('keydown',e=>{
      const dirs={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
      if(!dirs[e.key])return; e.preventDefault();
      const [dc,dr]=dirs[e.key], c=Math.max(0,Math.min(COLS-1,+b.dataset.col+dc)), r=Math.max(0,Math.min(ROWS-1,+b.dataset.row+dr));
      if(!occupied(c,r,b)){b.dataset.col=c;b.dataset.row=r;place(b,true)}
    });
  });
  if(board){layout();window.addEventListener('resize',layout,{passive:true});}
})();