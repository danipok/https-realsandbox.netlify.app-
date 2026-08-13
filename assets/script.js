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

  const heroSandbox = document.querySelector('.hero-rainbow');
  if (heroSandbox && !heroSandbox.querySelector('[style]')) {
    const rainbow = ['#e85d75', '#ef8a3d', '#e8b84f', '#9fbd3b', '#4aa6b5', '#5b6cc0', '#8b4b8f'];
    const word = heroSandbox.textContent.trim();
    heroSandbox.setAttribute('aria-label', word);
    heroSandbox.innerHTML = [...word]
      .map((letter, index) => `<span aria-hidden="true" style="color:${rainbow[index % rainbow.length]};display:inline-block">${letter}</span>`)
      .join('');
  }

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

  // Journey board: 5 positions horizontally × 3 vertically.
  // One drag is intentionally locked to either the horizontal or vertical axis.
  const journeyBoard = document.querySelector('[data-journey-board]');
  const journeyBlocks = [...(journeyBoard?.querySelectorAll('[data-journey-block]') ?? [])];
  const COLS = 5;
  const ROWS = 3;
  let journeyMetrics = null;
  let journeyDrag = null;

  const occupiedBy = (col, row, except = null) => journeyBlocks.find((block) => {
    if (block === except) return false;
    return Number(block.dataset.col) === col && Number(block.dataset.row) === row;
  });

  const measureJourney = () => {
    if (!journeyBoard) return null;
    const styles = getComputedStyle(journeyBoard);
    const gap = parseFloat(styles.getPropertyValue('--journey-gap')) || 16;
    const width = journeyBoard.clientWidth;
    const height = journeyBoard.clientHeight;
    return {
      gap,
      cellW: (width - gap * (COLS - 1)) / COLS,
      cellH: (height - gap * (ROWS - 1)) / ROWS,
      width,
      height
    };
  };

  const cellPosition = (col, row) => ({
    left: col * (journeyMetrics.cellW + journeyMetrics.gap),
    top: row * (journeyMetrics.cellH + journeyMetrics.gap)
  });

  const placeJourneyBlock = (block, animate = true) => {
    if (!journeyMetrics) return;
    const col = Number(block.dataset.col);
    const row = Number(block.dataset.row);
    const { left, top } = cellPosition(col, row);
    block.style.width = `${journeyMetrics.cellW}px`;
    block.style.height = `${journeyMetrics.cellH}px`;
    if (!animate) block.style.transition = 'none';
    block.style.left = `${left}px`;
    block.style.top = `${top}px`;
    if (!animate) requestAnimationFrame(() => { block.style.transition = ''; });
  };

  const layoutJourney = () => {
    if (!journeyBoard) return;
    journeyMetrics = measureJourney();
    journeyBlocks.forEach((block) => placeJourneyBlock(block, false));
  };

  const moveJourneyKeyboard = (block, dc, dr) => {
    const col = Number(block.dataset.col);
    const row = Number(block.dataset.row);
    const nextCol = Math.max(0, Math.min(COLS - 1, col + dc));
    const nextRow = Math.max(0, Math.min(ROWS - 1, row + dr));
    if ((nextCol === col && nextRow === row) || occupiedBy(nextCol, nextRow, block)) return;
    block.dataset.col = String(nextCol);
    block.dataset.row = String(nextRow);
    placeJourneyBlock(block);
  };

  journeyBlocks.forEach((block) => {
    block.addEventListener('keydown', (event) => {
      const moves = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1]
      };
      if (!moves[event.key]) return;
      event.preventDefault();
      moveJourneyKeyboard(block, ...moves[event.key]);
    });

    block.addEventListener('pointerdown', (event) => {
      if (!journeyBoard || !journeyMetrics) return;
      event.preventDefault();
      const rect = block.getBoundingClientRect();
      const boardRect = journeyBoard.getBoundingClientRect();
      journeyDrag = {
        block,
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startLeft: rect.left - boardRect.left,
        startTop: rect.top - boardRect.top,
        startCol: Number(block.dataset.col),
        startRow: Number(block.dataset.row),
        axis: null
      };
      block.setPointerCapture(event.pointerId);
      block.classList.add('dragging');
      journeyBoard.classList.add('is-dragging');
    });

    block.addEventListener('pointermove', (event) => {
      if (!journeyDrag || journeyDrag.block !== block || !journeyMetrics) return;
      const dx = event.clientX - journeyDrag.startX;
      const dy = event.clientY - journeyDrag.startY;
      if (!journeyDrag.axis && Math.max(Math.abs(dx), Math.abs(dy)) > 7) {
        journeyDrag.axis = Math.abs(dx) >= Math.abs(dy) ? 'x' : 'y';
      }
      if (!journeyDrag.axis) return;

      block.style.transition = 'none';
      if (journeyDrag.axis === 'x') {
        const maxLeft = journeyMetrics.width - journeyMetrics.cellW;
        const left = Math.max(0, Math.min(maxLeft, journeyDrag.startLeft + dx));
        block.style.left = `${left}px`;
        block.style.top = `${journeyDrag.startTop}px`;
      } else {
        const maxTop = journeyMetrics.height - journeyMetrics.cellH;
        const top = Math.max(0, Math.min(maxTop, journeyDrag.startTop + dy));
        block.style.top = `${top}px`;
        block.style.left = `${journeyDrag.startLeft}px`;
      }
    });

    const finishJourneyDrag = (event) => {
      if (!journeyDrag || journeyDrag.block !== block || !journeyMetrics) return;
      try { block.releasePointerCapture(journeyDrag.pointerId); } catch (_) {}
      block.style.transition = '';

      let targetCol = journeyDrag.startCol;
      let targetRow = journeyDrag.startRow;
      if (journeyDrag.axis === 'x') {
        const left = parseFloat(block.style.left) || journeyDrag.startLeft;
        targetCol = Math.max(0, Math.min(COLS - 1, Math.round(left / (journeyMetrics.cellW + journeyMetrics.gap))));
      } else if (journeyDrag.axis === 'y') {
        const top = parseFloat(block.style.top) || journeyDrag.startTop;
        targetRow = Math.max(0, Math.min(ROWS - 1, Math.round(top / (journeyMetrics.cellH + journeyMetrics.gap))));
      }

      if (!occupiedBy(targetCol, targetRow, block)) {
        block.dataset.col = String(targetCol);
        block.dataset.row = String(targetRow);
      }

      block.classList.remove('dragging');
      journeyBoard.classList.remove('is-dragging');
      journeyDrag = null;
      placeJourneyBlock(block);
    };

    block.addEventListener('pointerup', finishJourneyDrag);
    block.addEventListener('pointercancel', finishJourneyDrag);
  });

  if (journeyBoard) {
    layoutJourney();
    window.addEventListener('resize', layoutJourney, { passive: true });
  }
})();
