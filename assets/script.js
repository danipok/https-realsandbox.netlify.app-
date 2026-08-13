(() => {
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');

  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 12);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  menuButton?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton?.setAttribute('aria-expanded', 'false');
    });
  });

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('visible'));
  }

  const prompts = [
    'Which challenge are you strangely curious about?',
    'What would become possible if one assumption disappeared?',
    'Who sees something in this situation that you do not?',
    'Which of your values should have more influence on your next decision?',
    'What could you test before you decide?',
    'What do you already have that could become a resource?',
    'If this obstacle were an invitation, what would it invite you to do?',
    'With whom could this idea become more interesting?'
  ];

  let promptIndex = Math.floor(Math.random() * prompts.length);
  const promptBox = document.querySelector('[data-prompt-box]');
  document.querySelectorAll('[data-prompt-button]').forEach((button) => {
    button.addEventListener('click', () => {
      promptIndex = (promptIndex + 1) % prompts.length;
      if (promptBox) {
        promptBox.hidden = false;
        promptBox.textContent = prompts[promptIndex];
        promptBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });

  const sandbox = document.querySelector('[data-sandbox]');
  const draggableTiles = sandbox?.querySelectorAll('[data-draggable]') ?? [];
  let activeTile = null;
  let pointerOffsetX = 0;
  let pointerOffsetY = 0;

  const getPosition = (event) => {
    const bounds = sandbox.getBoundingClientRect();
    const tileBounds = activeTile.getBoundingClientRect();
    const x = Math.min(Math.max(event.clientX - bounds.left - pointerOffsetX, 0), bounds.width - tileBounds.width);
    const y = Math.min(Math.max(event.clientY - bounds.top - pointerOffsetY, 0), bounds.height - tileBounds.height);
    return { x, y };
  };

  draggableTiles.forEach((tile) => {
    tile.addEventListener('pointerdown', (event) => {
      if (!sandbox) return;
      activeTile = tile;
      const tileBounds = tile.getBoundingClientRect();
      pointerOffsetX = event.clientX - tileBounds.left;
      pointerOffsetY = event.clientY - tileBounds.top;
      tile.setPointerCapture(event.pointerId);
      tile.style.zIndex = '10';
    });

    tile.addEventListener('pointermove', (event) => {
      if (activeTile !== tile || !sandbox) return;
      const { x, y } = getPosition(event);
      tile.style.left = `${x}px`;
      tile.style.top = `${y}px`;
      tile.style.right = 'auto';
      tile.style.bottom = 'auto';
      tile.style.transform = 'rotate(0deg)';
    });

    const release = (event) => {
      if (activeTile !== tile) return;
      try { tile.releasePointerCapture(event.pointerId); } catch (_) {}
      tile.style.zIndex = '';
      activeTile = null;
    };

    tile.addEventListener('pointerup', release);
    tile.addEventListener('pointercancel', release);
  });
})();
