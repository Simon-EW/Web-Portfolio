const postElem = document.querySelector<HTMLDivElement>('.post');
const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

if (!postElem) {
  throw new Error('No post element found');
}

if (!postId) {
  window.location.href = './posts.html';
}

const setup = async () => {
  console.log('postId', postId);
  const res = await fetch(`/api/posts/${postId}`);

  const post = await res.json();

  if (res.status !== 200) {
    postElem!.innerHTML = `<h1>Post not found</h1>`;
    return;
  }

  postElem.innerHTML = `
          <h1>${post.title}</h1>
          <p>${post.content}</p>
      `;
};

setup();
