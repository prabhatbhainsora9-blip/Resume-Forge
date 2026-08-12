# ResumeFlow Backend

REST API backend for ResumeFlow, a resume builder application.

Built with Node.js, Express.js, and MySQL, with JWT-based authentication and secure password hashing.

## Tech Stack

- Node.js
- Express.js
- MySQL
- bcryptjs
- JSON Web Token (JWT)

## Features

- User registration and login
- JWT authentication
- Secure password hashing
- Resume CRUD operations
- User-specific resume access
- MySQL database integration
- RESTful API architecture

## Project Structure

Backend/
├── middleware/
├── routes/
├── .env
├── .gitignore
├── db.js
├── server.js
├── package.json
└── README.md

## Setup

Install dependencies:

npm install

Create a .env file:

DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=resume_forge
JWT_SECRET=your_secret_key
PORT=5000

Start the server:

node server.js

Server:

http://localhost:5000

## API Routes

### Users

POST   /api/users
POST   /api/users/login
GET    /api/users/me
GET    /api/users
GET    /api/users/:id

### Resumes

POST   /api/resumes
GET    /api/resumes
GET    /api/resumes/:id
PUT    /api/resumes/:id
DELETE /api/resumes/:id

## Database

Database: resume_forge

Main tables:

users
documents
sections
items
templates
shares
exports
applications
versions

## Security

- Passwords are hashed using bcryptjs.
- Authentication uses JWT.
- Protected resume routes verify user ownership.
- Sensitive environment variables are excluded from Git using .gitignore.

## Status

Backend completed and ready for frontend integration.
