(() => {
  const lockers = document.querySelectorAll('.locker--closed[data-locker]');
  const wall = document.querySelector('.locker-wall');
  const OPEN_DELAY = 260;
  const SNOOP_DURATION = 700;

  let surpriseRevealed = false;
  let placeSurprise = () => {};
  let checkAllOpen = () => {};

  if (wall && lockers.length) {
    wall.style.position = 'relative';

    const surprise = document.createElement('p');
    surprise.className = 'locker-surprise';
    surprise.setAttribute('role', 'status');
    surprise.setAttribute('aria-live', 'polite');
    surprise.setAttribute('aria-hidden', 'true');
    surprise.style.position = 'absolute';
    surprise.style.zIndex = '5';
    surprise.style.margin = '0';
    surprise.style.textAlign = 'center';
    surprise.style.whiteSpace = 'nowrap';
    surprise.style.pointerEvents = 'none';
    surprise.style.fontFamily = "Georgia, 'Times New Roman', serif";
    surprise.style.fontWeight = '800';
    surprise.style.fontSize = 'clamp(1rem, 1.25vw, 1.25rem)';
    surprise.style.lineHeight = '1.05';
    surprise.style.letterSpacing = '-.02em';
    surprise.style.opacity = '0';

    const leftSparkle = document.createElement('span');
    leftSparkle.textContent = '✦';
    leftSparkle.setAttribute('aria-hidden', 'true');
    leftSparkle.style.color = '#b98722';
    leftSparkle.style.fontSize = '.78em';
    leftSparkle.style.marginRight = '8px';

    const message = document.createElement('span');
    message.textContent = 'Feels like Joulukalenteri? ;)';
    message.style.backgroundImage = 'linear-gradient(90deg,#c94f66 0%,#6f8a2a 27%,#b98722 48%,#c94f66 67%,#2f7a89 84%,#6f8a2a 100%)';
    message.style.backgroundClip = 'text';
    message.style.webkitBackgroundClip = 'text';
    message.style.color = 'transparent';

    const rightSparkle = document.createElement('span');
    rightSparkle.textContent = '✦';
    rightSparkle.setAttribute('aria-hidden', 'true');
    rightSparkle.style.color = '#6f8a2a';
    rightSparkle.style.fontSize = '.78em';
    rightSparkle.style.marginLeft = '8px';

    surprise.append(leftSparkle, message, rightSparkle);
    wall.appendChild(surprise);

    placeSurprise = () => {
      const wallRect = wall.getBoundingClientRect();
      const lockerRects = Array.from(lockers, locker => locker.getBoundingClientRect());
      const left = Math.min(...lockerRects.map(rect => rect.left));
      const right = Math.max(...lockerRects.map(rect => rect.right));
      const top = Math.min(...lockerRects.map(rect => rect.top));
      const height = surprise.getBoundingClientRect().height || 22;

      surprise.style.left = `${left - wallRect.left}px`;
      surprise.style.width = `${right - left}px`;
      surprise.style.top = `${top - wallRect.top - height - 10}px`;
    };

    const revealSurprise = () => {
      if (surpriseRevealed) return;
      surpriseRevealed = true;

      requestAnimationFrame(() => {
        placeSurprise();
        surprise.setAttribute('aria-hidden', 'false');
        surprise.style.opacity = '1';

        if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
          surprise.animate(
            [
              { opacity: 0, transform: 'translateY(7px) scale(.97)' },
              { opacity: 1, transform: 'translateY(0) scale(1)' }
            ],
            { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)' }
          );
        }
      });
    };

    checkAllOpen = () => {
      if (!surpriseRevealed && Array.from(lockers).every(locker => locker.getAttribute('aria-expanded') === 'true')) {
        revealSurprise();
      }
    };

    window.addEventListener('resize', () => {
      if (surpriseRevealed) placeSurprise();
    });
  }

  lockers.forEach(locker => {
    const content = locker.querySelector('.locker-content');
    let clickTimer = null;
    let snoopTimer = null;

    const setOpen = (open, snoop = false) => {
      locker.classList.toggle('is-open', open);
      locker.setAttribute('aria-expanded', String(open));
      if (content) content.setAttribute('aria-hidden', String(!open));

      if (snoop) {
        locker.classList.add('is-snoop');
        clearTimeout(snoopTimer);
        snoopTimer = setTimeout(() => locker.classList.remove('is-snoop'), SNOOP_DURATION);
      }

      checkAllOpen();
    };

    locker.addEventListener('click', () => {
      if (clickTimer) return;
      clickTimer = setTimeout(() => {
        clickTimer = null;
        const nowOpen = locker.getAttribute('aria-expanded') !== 'true';
        setOpen(nowOpen);
      }, OPEN_DELAY);
    });

    locker.addEventListener('dblclick', e => {
      e.preventDefault();
      clearTimeout(clickTimer);
      clickTimer = null;
      setOpen(true, true);
    });
  });

  // Settle the open lockers' heartbeat pulse once the visitor has had time to
  // notice it, or as soon as they open any locker - whichever happens first.
  if (wall) {
    let settleTimer = null;
    const settle = () => {
      wall.classList.add('settled');
      clearTimeout(settleTimer);
    };

    if ('IntersectionObserver' in window) {
      const wallObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !settleTimer) {
            settleTimer = setTimeout(settle, 9000);
          }
        });
      }, { threshold: .3 });
      wallObserver.observe(wall);
    } else {
      settle();
    }

    lockers.forEach(locker => locker.addEventListener('click', settle, { once: true }));
  }
})();
