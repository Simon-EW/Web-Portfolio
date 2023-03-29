const list = document.querySelector('.image-wrapper');

for (let i = 1; i < 10; i++) {
  const element = document.createElement('img');
  list.appendChild(element);
  element.src = 'images/' + i + '.jpg';
  element.alt = 'Joey Chestnut ' + i;
}
