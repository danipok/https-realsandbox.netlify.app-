(() => {
  const lockers = document.querySelectorAll('.locker--closed[data-locker]');
  const OPEN_DELAY = 260;
  const SNOOP_DURATION = 700;

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
  const wall = document.querySelector('.locker-wall');
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
