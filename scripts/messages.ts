const messageElem = document.querySelector<HTMLUListElement>('.messages');

if (!messageElem) {
  throw new Error('No message element found');
}

const main = async () => {
  const res = await fetch('../api/messages?start=0&end=10');
  const messages = await res.json();
  console.log('messages', messages);
  messageElem.innerHTML = messages
    .map(
      (message: any) => `
        <li>
        <h3>${message.name}</h3>
        <p>${message.subject}</p>
        </li>
    `,
    )
    .join('');
};

main();
