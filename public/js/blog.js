const newCommentHandler = async (event) => {
  event.preventDefault();

  const contents = document.querySelector('#comment-contents').value.trim();
  const url = window.location.href.split('/');
  const blog_id = url[url.length - 1];

  if (contents) {
    const response = await fetch(`/api/comments/`, {
      method: 'POST',
      body: JSON.stringify({ contents, blog_id }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      document.location.replace(`/blog/${blog_id}`);
    } else {
      alert('Failed to create comment');
    }
  }
};

const delButtonHandler = async (event) => {
  if (event.target.hasAttribute('data-id')) {
    const id = event.target.getAttribute('data-id');

    const response = await fetch(`/api/comments/${id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace(`/blog/${blog_id}`);
    } else {
      alert('Failed to delete comment');
    }
  }
};

document
  .querySelector('.new-comment-form')
  .addEventListener('submit', newCommentHandler);

document
  .querySelector('.comment-list')
  .addEventListener('click', delButtonHandler);