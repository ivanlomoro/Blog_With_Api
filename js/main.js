let currentPage = 1;
const postsPerPage = 12;
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

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
    getData(`https://jsonplaceholder.typicode.com/users/${post.userId}`)
      .then(userDetails => {
        const postModalContent = `
          <div class="modal-header">
            <h5 class="modal-title">${post.title}</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p>${post.body}</p>
            <p>Usuario: ${userDetails.username}</p>
            <p>Email: ${userDetails.email}</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" id="load-comments">Load comments</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
          </div>
        `;
  
        const postModal = document.getElementById('postModal');
        const modalContent = postModal.querySelector('.modal-content');
        modalContent.innerHTML = postModalContent;
  
        const loadCommentsButton = document.getElementById('load-comments');
        loadCommentsButton.addEventListener('click', () => {
          getData(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
            .then(comments => {
              displayComments(comments);
            })
            .catch(error => console.error('Error:', error));
        });
  
        const myModal = new bootstrap.Modal(postModal);
        myModal.show();
      })
      .catch(error => console.error('Error:', error));
  }
  
  // Función para mostrar los comentarios en el modal del post
  function displayComments(comments) {
    const modalBody = document.querySelector('.modal-body');
    const commentsList = document.createElement('ul');
    commentsList.classList.add('list-group', 'mt-3');
  
    comments.forEach(comment => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.innerHTML = `
        <strong>${comment.name}</strong>
        <p>${comment.body}</p>
      `;
      commentsList.appendChild(listItem);
    });
  
    modalBody.appendChild(commentsList);
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