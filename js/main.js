// Función para obtener datos de una URL.
function getData(url) {
    return fetch(url) // Hacer la solicitud
        .then(response => response.json()); // Convertir la respuesta a formato JSON
}
  
  // Función para mostrar la lista de posts en el contenedor principal
  function displayPosts(posts) {
    const postListContainer = document.getElementById('post-list');
    postListContainer.innerHTML = ''; // Limpia el contenido actual
  
    posts.forEach(post => {

      const cardContainer = document.createElement('div');
      cardContainer.classList.add('px-1', 'mb-3');  
        
      const postCard = document.createElement('div');
      postCard.classList.add('card', 'h-100');

      const imageContainer = document.createElement('div');
      imageContainer.classList.add('p-2');

      const cardImage = document.createElement('img');
      cardImage.classList.add('card-img-top', 'mt-3', 'rounded', 'mx-auto', 'd-block');
      cardImage.src = "./assets/img-post.jpg";
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
  
// Función para inicializar todo y cargar los datos iniciales
function init() {
    getData('https://jsonplaceholder.typicode.com/posts?_limit=12') // Obtener los posts
        .then(posts => {
            displayPosts(posts) // Mostrar cada post
        })
        .catch(error => console.error('Error:', error)); // Manejar cualquier error que pueda ocurrir
}
  
  init();
  