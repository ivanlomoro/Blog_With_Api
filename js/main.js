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