# Blog with API

This is a simple blog application that fetches and displays posts from the JSONPlaceholder API. Users can view, edit, and delete posts, as well as load comments for each post.

## Features

- Display a list of posts with titles and images.
- Load more posts as the user scrolls.
- View detailed information about a post, including title, body, author details, and comments.
- Edit a post's title and body.
- Delete a post.
- Load comments for a post.

## Technologies Used

- HTML
- CSS (Bootstrap)
- JavaScript

## Getting Started

1. Clone the repository to your local machine.
2. Navigate to the project directory.
3. Open the `index.html` file in your browser.

## Usage

1. The main page displays a list of posts.
2. Click on a post to view its details.
3. On the post details page, you can edit the post title and body by clicking the "Edit" button.
4. To delete a post, click the "Delete" button.
5. To load comments for a post, click the "Load comments" button.
6. To load more posts, click the "Load more" button at the bottom of the page.

## API

The application fetches data from the JSONPlaceholder API. The API base URL is `https://jsonplaceholder.typicode.com`.

## Simulating Data Editing and Deletion

To simulate editing and deletion of data, you can use `json-server` to serve the data located in the `./data/db.json` file. To do this:

1. Open a terminal in Visual Studio Code.
2. Navigate to the project directory.
3. Run the command: `json-server .\data\db.json`

This will start `json-server` and use the data from the `db.json` file as the API source. Now, edits and deletions will be simulated using this local server.

## Support and Contact

Thank you for taking the time to explore my work. If you have any questions, suggestions, or feedback, feel free to reach out to me on LinkedIn or through email at [ivanmartin_95@hotmail.com](mailto:ivanmartin_95@hotmail.com).

Have a fantastic day and keep coding! 👨‍💻 💻
