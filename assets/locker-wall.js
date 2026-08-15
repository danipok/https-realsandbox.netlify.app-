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
})();
