Superhero REST API
This project is a RESTful API for managing a collection of superheroes. The API allows you to create, view, update, and delete superhero data, including uploading images.

Core Technologies
Node.js
Express.js — The web framework for Node.js
MongoDB — The NoSQL database
Mongoose — An ODM for MongoDB
TypeScript — For static typing
React — The frontend library for building the user interface
Redux Toolkit — For efficient state management in React
express-fileupload — Middleware for handling file uploads

Installation and Startup
To get the project up and running locally, follow these steps.

1. Clone the repository
   First, clone the project from GitHub and navigate to the project root directory.

   git clone https://github.com/svbarytskiy/jsn-test

   cd jsn-test

3. Install dependencies
   This project is a monorepo with shared dependencies. Install all dependencies for the backend and frontend.
   Install shared dependencies (ESLint, Husky, etc.):

   npm install

   Install backend dependencies:

   cd server
   npm install

   Install client dependencies:

   cd ../client
   npm install

4. Configure environment variables
   You need to set up environment variables for both the backend and frontend. Create a .env file in each of the respective folders.
   Backend .env (in the server folder):

   PORT=5000
   DB_USER=Tester
   DB_PASSWORD=j6t0ZtixBvU0ZK64
   DB_NAME=Superheroes

5. Run the application
   You need to run both the backend and frontend servers in separate terminal windows.
   Start the backend (in the server folder):

   npm run dev

   Start the client (in the client folder):

   npm run dev

The backend server will be available at http://localhost:5000, and the client application will be running on http://localhost:5173
