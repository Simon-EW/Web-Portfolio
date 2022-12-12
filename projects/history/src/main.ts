document.querySelectorAll('img').forEach(img => {
  img.addEventListener('click', () => {
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
  });
});
