
# TracknTrade
* TracknTrade is a web application designed for trading enthusiasts. The frontend is built with React and Vite, while the backend uses Node.js and Express.

# Prerequisites
* Node.js (v14+)
* npm
* Installation
* Clone the repository:

* bash
* Copy code
* git clone https://github.com/Anhad928/trackntrade.git
* cd trackntrade
# Frontend Setup:

* bash
* Copy code
* cd trackntrade-frontend
* npm install
* npm run dev
# Backend Setup:

* bash
* Copy code
* cd ../trackntrade-backend
* npm install
* npm start
# Access the App:

# Frontend: http://localhost:5174
# Backend: http://localhost:3001
# Project Structure
* trackntrade-frontend: React frontend using Vite.
* trackntrade-backend: Node.js backend using Express.
# Notes
* Ensure auth.png is in the public directory of the frontend for the background image.
* Modify the Clerk frontend API key in ClerkProvider as needed.

# To Delete Migrations from Database
 * npx knex migrate:rollback --all
# To Add the Migrations to Database
  * npx knex migrate:latest


# For Changes in .env file we have to 
* Update the database url and with your name of device for that run command 'whoami' and change the password to in .env file
