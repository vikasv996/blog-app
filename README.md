# Blog Management Application

A full-stack blog management platform built using Node.js, Express.js, MongoDB, React, and JWT Authentication.

The application allows users to securely register, log in, and manage blog posts through protected REST APIs and a
responsive frontend interface.

## Features

### Authentication

* User Registration
* User Login
* JWT Access Token Authentication
* Protected Routes

### Blog Management

* Create Blog Posts
* Update Existing Blogs
* Delete Blogs
* List Blogs
* Search by Title
* Search by Description
* Pagination Support
* Sorting Support

### Backend

* Node.js
* Express.js
* MongoDB
* JWT Authentication
* Joi Validation
* Bcrypt Password Hashing

### Frontend

* React
* Material UI
* Axios
* React Router

## Tech Stack

| Layer             | Technology         |
|-------------------|--------------------|
| Frontend          | React, Material UI |
| Backend           | Node.js, Express   |
| Database          | MongoDB            |
| Authentication    | JWT                |
| Validation        | Joi                |
| Password Security | Bcrypt             |

## API Endpoints

### Authentication

| Method | Endpoint       |
|--------|----------------|
| POST   | /auth/register |
| POST   | /auth/login    |
| DELETE | /auth/logout   |

### Blogs

| Method | Endpoint     |
|--------|--------------|
| POST   | /blog/add    |
| POST   | /blog/update |
| POST   | /blog/list   |
| DELETE | /blog/remove |

## Installation

### Clone Repository

```bash
git clone <repository-url>
```

### Install Backend Dependencies

```bash
npm install
```

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Run Application

Backend:

```bash
npm run server
```

Frontend:

```bash
cd client
npm start
```

Or run both together:

```bash
npm run develop
```

## Future Improvements

* Refresh Tokens
* Role Based Access Control
* Rich Text Editor
* Blog Categories and Tags
* Image Upload Support
* Docker Deployment
* Unit & Integration Tests
* CI/CD Pipeline

## License

MIT
