# Online Shopping API

## Overview

The Online Shopping API is a comprehensive e-commerce backend solution built with modern technologies. It provides a robust set of endpoints for managing various aspects of an online shopping platform, including user authentication, product management, order processing, and vendor operations.

## Live Demo

You can view and interact with the live version of the API at:

[http://98.83.215.67/](http://98.83.215.67/)

Feel free to explore the endpoints and test the functionality of the API. Please note that this is a demo environment, so use it responsibly.

## Features

- **Admin Management**: Secure endpoints for user resource management.
- **User Authentication**: Complete user lifecycle management.
- **Product Management**: CRUD operations for product catalog.
- **Shopping Cart**: Fully functional cart management system.
- **Order Processing**: End-to-end order lifecycle support.
- **Complaint System**: User-friendly complaint submission and management.
- **Vendor Operations**: Vendor-specific data retrieval and order management.

## Technology Stack

- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Sequelize ORM
- **Containerization**: Docker, Docker Compose
- **Server**: Nginx
- **Deployment**: Amazon EC2

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Docker and Docker Compose
- PostgreSQL

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Abdelrahman-Mohamed-Abdelaty/online-shopping-app.git
   ```

2. Navigate to the project directory:
   ```
   cd online-shopping-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Set up environment variables (create a `.env` file based on `.env.example`).

5. Run the application:

   For development with live reloading:
   ```
   npm start
   ```

   For development without TypeScript watch:
   ```
   npm run start-dev
   ```

   For production:
   ```
   npm run start-prod
   ```

### Docker Deployment

To build and push Docker images for production:
```
npm run push-image
```

This command compiles TypeScript, builds Docker images using the production configuration, and pushes them to the configured Docker registry.

## Scripts

The project includes the following npm scripts:

- `npm start`: Runs the TypeScript compiler in watch mode and starts the server with nodemon for development.
- `npm run start-dev`: Starts the server with nodemon using the compiled JavaScript.
- `npm run start-prod`: Starts the server in production mode.
- `npm run push-image`: Compiles TypeScript, builds Docker images for production, and pushes them to the registry.

## API Documentation

Comprehensive API documentation is available on Postman. You can view and test the API endpoints here:

[API Documentation on Postman](https://documenter.getpostman.com/view/32602280/2sAXqtagQi)

## Docker Image

The Docker image for this project is available on Docker Hub:

[Online Shopping API Docker Image](https://registry.hub.docker.com/r/abdelrahman370/online-shopping)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

Abdelrahman Mohamed Abdelaty - [My LinkedIn Profile](https://www.linkedin.com/in/your-profile/)

---

Feel free to star ⭐ this repository if you find it helpful!