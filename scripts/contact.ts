const contactForm = document.querySelector<HTMLFormElement>('.contact-form');

contactForm?.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.target as HTMLFormElement);
  console.log('formData', formData);
  const res = await fetch('../api/form', {
    body: formData,
    method: 'POST',
  });
  console.log('res', res.status);
});
