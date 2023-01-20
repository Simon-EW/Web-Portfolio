const addModal = (img: HTMLImageElement | null) => {
  if (!img) return;
  const src = img.getAttribute('src');
  const modal = document.createElement('div');
  const imgElem = document.createElement('img');

  imgElem.classList.add('modal-content');
  imgElem.setAttribute('src', src ?? '');
  modal.classList.add('modal');

  document.body.appendChild(modal);
  modal.appendChild(imgElem);
  modal.addEventListener('click', () => {
    modal.remove();
  });
};

const clearModals = () => {
  document.querySelectorAll('.modal').forEach(modal => modal.remove());
};

const modalExists = () => document.querySelector('.modal') !== null;

document.querySelectorAll('img').forEach(img => {
  img.tabIndex = 0;
  img.addEventListener('click', () => addModal(img));
});

const mobileNavToggle = document.querySelector<HTMLLabelElement>('.mobile-nav-toggle');
const navCheckbox = document.querySelector<HTMLInputElement>('#mobile-nav');

// Make sure the mobile nav toggle is focusable
mobileNavToggle!.tabIndex = 0;

const links = document.querySelectorAll<HTMLAnchorElement>('.nav-item > a');

// Close mobile nav when a link is clicked
links.forEach(link => {
  link.addEventListener('click', () => {
    if (navCheckbox?.checked) navCheckbox.checked = false;
  });
});

document.addEventListener('keydown', e => {
  switch (e.key) {
    case 'Escape':
      clearModals();
      break;
    case 'Enter':
      if (document.activeElement?.classList.contains('mobile-nav-toggle')) navCheckbox?.click();
      if (document.activeElement?.nodeName !== 'IMG') return;
      if (modalExists()) return clearModals();
      addModal(document.activeElement as HTMLImageElement | null);
      break;
    case 'Tab':
      if (modalExists()) clearModals();
      break;
  }
});
