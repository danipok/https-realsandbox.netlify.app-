(() => {
  const section = document.querySelector('#official-view');
  if (!section) return;

  section.querySelector('.section-kicker')?.remove();

  const text = section.querySelector('.official-view-text');
  if (text) text.textContent = 'The official university description gives the formal frame.';

  const link = section.querySelector('.official-view-copy .button');
  if (link) link.innerHTML = 'How we see it <span aria-hidden="true">↓</span>';

  const mockup = section.querySelector('.official-mockup');
  if (!mockup) return;

  const photo = document.createElement('button');
  photo.type = 'button';
  photo.className = 'official-photo-button';
  photo.setAttribute('aria-expanded', 'false');
  photo.setAttribute('aria-label', 'Enlarge the official Hanken course description screenshot');
  photo.innerHTML = '<img src="assets/official-course-view.webp" alt="Official Hanken Sisu course description for Sandbox for Creative Entrepreneurs." />';

  const backdrop = document.createElement('button');
  backdrop.type = 'button';
  backdrop.className = 'official-photo-backdrop';
  backdrop.setAttribute('aria-label', 'Close enlarged course description');
  backdrop.hidden = true;

  mockup.replaceWith(photo);
  document.body.appendChild(backdrop);

  const setOpen = (open) => {
    document.body.classList.toggle('official-photo-open', open);
    photo.setAttribute('aria-expanded', String(open));
    backdrop.hidden = !open;
  };

  photo.addEventListener('click', () => setOpen(!document.body.classList.contains('official-photo-open')));
  backdrop.addEventListener('click', () => setOpen(false));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') setOpen(false);
  });
})();
