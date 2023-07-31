let currentPage = 1;
const postsPerPage = 12;
const apiUrl = 'http://localhost:3000/posts';
let commentsVisible = false;

// Función para obtener datos de una URL.
function getData(url) {
  return fetch(url) // Hacer la solicitud
    .then(response => response.json()); // Convertir la respuesta a formato JSON
}

// Función para mostrar la lista de posts en el contenedor principal
function displayPosts(posts) {
  const postListContainer = document.getElementById('post-list');

  posts.forEach(post => {

    const cardContainer = document.createElement('div');
    cardContainer.classList.add('px-1', 'mb-3');

    const postCard = document.createElement('div');
    postCard.classList.add('card', 'h-100');

    const imageContainer = document.createElement('div');
    imageContainer.classList.add('p-2');

    const cardImage = document.createElement('img');
    cardImage.classList.add('card-img-top', 'mt-3', 'rounded', 'mx-auto', 'd-block');
    cardImage.src = "./assets/img-space.jpg";
    cardImage.style.width = '90%';

    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');

    const postTitle = document.createElement('h5');
    postTitle.classList.add('card-title');
    postTitle.textContent = post.title;


    cardBody.appendChild(postTitle);
    postCard.appendChild(cardImage);
    postCard.appendChild(cardBody);
    cardContainer.appendChild(postCard);
    postListContainer.appendChild(cardContainer);

    // Agregar evento para mostrar el modal con los detalles del post
    postCard.addEventListener('click', () => {
      displayPostDetails(post);
    });
  });
}

// Función para cargar más posts
function loadMorePosts() {
  currentPage++;
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;

  getData(apiUrl)
    .then(posts => {
      const postsToShow = posts.slice(startIndex, endIndex);
      displayPosts(postsToShow);

      // Si no hay más posts para mostrar, ocultamos el botón "Cargar más posts"
      if (endIndex >= posts.length) {
        const loadMoreButton = document.getElementById('load-more-button');
        loadMoreButton.style.display = 'none';
      }
    })
    .catch(error => console.error('Error:', error));
}

// Función para mostrar el modal con los detalles de un post
function displayPostDetails(post) {
  getData(`http://localhost:3000/users/${post.userId}`)
    .then(userDetails => {
      const postModalContent = `
        <div class="modal-header">
          <h5 class="modal-title" contenteditable="false" id="post-title">${post.title}</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <p contenteditable="false" id="post-body">${post.body}</p>
          <p>Usuario: ${userDetails.username}</p>
          <p>Email: ${userDetails.email}</p>
          <div class="comments-section">
            <button type="button" class="btn btn-primary" id="toggle-comments">Load comments</button>
            <div class="comments-list mt-3"></div>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-warning" id="edit-button">Edit</button>
          <button type="button" class="btn btn-danger" id="delete-button">Delete</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
        `;

      const postModal = document.getElementById('postModal');
      const modalContent = postModal.querySelector('.modal-content');
      modalContent.innerHTML = postModalContent;

      const editButton = document.getElementById('edit-button');
      const deleteButton = document.getElementById('delete-button');
      const postTitle = document.getElementById('post-title');
      const postBody = document.getElementById('post-body');

      // Botón de editar
      editButton.addEventListener('click', () => {
        if (editButton.textContent === "Edit") {
          editButton.textContent = "Save";
          editButton.classList.remove('btn-warning');
          editButton.classList.add('btn-success');
          postTitle.contentEditable = "true";
          postBody.contentEditable = "true";

          // Añado la clase 'editing' para resaltar los elementos
          postTitle.classList.add('editing');
          postBody.classList.add('editing');

          // Cambio el cursor a un estado de "texto"
          postTitle.style.cursor = "text";
          postBody.style.cursor = "text";

        } else {
          // Aquí guardamos los cambios
          fetch(`http://localhost:3000/posts/${post.id}`, {
            method: 'PUT',
            body: JSON.stringify({
              id: post.id,
              title: postTitle.textContent,
              body: postBody.textContent,
              userId: post.userId
            }),
            headers: {
              'Content-type': 'application/json; charset=UTF-8'
            }
          })
            .then(response => response.json())
            .then(json => console.log(json))
            .then(updatedPost => {
              console.log(updatedPost);
              savePostChanges(updatedPost.id, updatedPost.title, updatedPost.body);
            })

          editButton.textContent = "Edit";
          editButton.classList.remove('btn-success');
          editButton.classList.add('btn-warning');
          postTitle.contentEditable = "false";
          postBody.contentEditable = "false";

          // Quita la clase 'editing' para volver a la apariencia normal
          postTitle.classList.remove('editing');
          postBody.classList.remove('editing');

          // Cambiar el cursor a un estado de "default"
          postTitle.style.cursor = "default";
          postBody.style.cursor = "default";
        }
      });



      // Botón de eliminar
      deleteButton.addEventListener('click', () => {
        const postModalInstance = bootstrap.Modal.getInstance(document.getElementById('postModal'));
        postModalInstance.hide();

        const deleteModalInstance = new bootstrap.Modal(document.getElementById('deleteModal'));

        // Evento que se dispara cuando el modal de eliminación se termina de ocultar
        document.getElementById('deleteModal').addEventListener('hidden.bs.modal', function (event) {
          postModalInstance.show();
        });

        deleteModalInstance.show();
      });


      const confirmDeleteButton = document.getElementById('confirmDeleteButton');
      confirmDeleteButton.addEventListener('click', () => {
        fetch(`http://localhost:3000/posts/${post.id}`, {
          method: 'DELETE',
        })
          .then(() => {
            console.log(`Post ${post.id} deleted`);
            deletePost(post.id);

            // Cerrar los modales
            const deleteModal = bootstrap.Modal.getInstance(document.getElementById('deleteModal'));
            deleteModal.hide();

            const postModal = bootstrap.Modal.getInstance(document.getElementById('postModal'));
            postModal.hide();
          })
          .catch(error => console.error('Error:', error));
      });



      const toggleCommentsButton = document.getElementById('toggle-comments');
      const commentsList = document.querySelector('.comments-list');

      toggleCommentsButton.addEventListener('click', () => {
        // Si los comentarios están visibles, los ocultamos y cambiamos el texto del botón
        if (commentsVisible) {
          commentsVisible = false;
          commentsList.innerHTML = '';
          toggleCommentsButton.textContent = 'Load comments';
        } else {
          // Si los comentarios no están visibles, los cargamos y cambiamos el texto del botón
          commentsVisible = true;
          getData(`http://localhost:3000/posts/${post.id}/comments`)
            .then(comments => {
              displayComments(comments, commentsList);
              toggleCommentsButton.textContent = 'Hide comments';
            })
            .catch(error => console.error('Error:', error));
        }
      });

      const myModal = new bootstrap.Modal(postModal);
      myModal.show();
    })
    .catch(error => console.error('Error:', error));
}

// Función para mostrar los comentarios en el modal del post
function displayComments(comments, commentsListContainer) {
  commentsListContainer.innerHTML = '';

  const commentsList = document.createElement('ul');
  commentsList.classList.add('list-group');

  comments.forEach(comment => {
    const listItem = document.createElement('li');
    listItem.classList.add('list-group-item');
    listItem.innerHTML = `
        <strong>${comment.name}</strong>
        <p>${comment.body}</p>
      `;
    commentsList.appendChild(listItem);
  });

  commentsListContainer.appendChild(commentsList);
}

function clearPostList() {
  const postListContainer = document.getElementById('post-list');
  while (postListContainer.firstChild) {
    postListContainer.removeChild(postListContainer.firstChild);
  }
}

function savePostChanges(postId, title, body) {
  const post = allPosts.find(p => p.id === postId);

  if (post) {
    post.title = title;
    post.body = body;

    clearPostList();
    const postsToShow = allPosts.slice(0, currentPage * postsPerPage);
    displayPosts(postsToShow);
  }
}

function deletePost(postId) {
  allPosts = allPosts.filter(p => p.id !== postId);

  clearPostList();
  const postsToShow = allPosts.slice(0, currentPage * postsPerPage);
  displayPosts(postsToShow);
}




// Función para inicializar todo y cargar los datos iniciales
function init() {
  const loadMoreButton = document.getElementById('load-more-button');
  loadMoreButton.addEventListener('click', loadMorePosts);

  getData(apiUrl)
    .then(posts => {
      const postsToShow = posts.slice(0, postsPerPage);
      displayPosts(postsToShow);

      // Si no hay más posts para mostrar, ocultamos el botón "Load more"
      if (posts.length <= postsPerPage) {
        loadMoreButton.style.display = 'none';
      }
    })
    .catch(error => console.error('Error:', error));
}

init();