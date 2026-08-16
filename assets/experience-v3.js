(() => {
  const sandbox = document.querySelector('[data-sandbox]');
  if (!sandbox) return;

  const portal = sandbox.querySelector('.sand-label');
  const pieces = [...sandbox.querySelectorAll('[data-draggable]')];
  if (!portal || !pieces.length) return;

  const openingMessage = 'drag a fragment into the unknown';
  const responses = {
    Challenge: 'What if the obstacle is an invitation?',
    Values: 'What would you refuse to trade away?',
    People: 'Who else could change the game?',
    Potential: 'What becomes possible if you stop asking permission?',
    Ideas: 'What if the first idea is only a doorway?',
    Curiosity: 'What if not knowing yet is the interesting part?'
  };

  const pieceName = piece => piece.querySelector('small')?.textContent?.trim() || 'Idea';
  const consumed = new Set();
  let currentMessage = openingMessage;
  let writing = false;

  const writePortal = message => {
    writing = true;
    portal.dataset.label = 'MELTING POT';
    portal.dataset.message = message;
    queueMicrotask(() => { writing = false; });
  };

  writePortal(openingMessage);

  const pieceObserver = new MutationObserver(entries => {
    entries.forEach(({ target }) => {
      const isConsumed = target.classList.contains('consumed');
      if (isConsumed && !consumed.has(target)) {
        consumed.add(target);
        currentMessage = responses[pieceName(target)] || 'What else changes when you look again?';
        writePortal(currentMessage);
      } else if (!isConsumed && consumed.has(target)) {
        consumed.delete(target);
      }
    });

    if (consumed.size === 0) {
      currentMessage = openingMessage;
      writePortal(openingMessage);
    }
  });

  pieces.forEach(piece => pieceObserver.observe(piece, { attributes:true, attributeFilter:['class'] }));

  const portalObserver = new MutationObserver(() => {
    if (writing) return;
    if (portal.dataset.label === 'LET GO' || sandbox.classList.contains('portal-ready')) return;

    const desired = consumed.size ? currentMessage : openingMessage;
    if (portal.dataset.label !== 'MELTING POT' || portal.dataset.message !== desired) {
      writePortal(desired);
    }
  });

  portalObserver.observe(portal, { attributes:true, attributeFilter:['data-label','data-message'] });
})();
