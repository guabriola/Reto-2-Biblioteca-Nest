# Reto-2 DigitalNao - Library Booking API-REST 1.0

## Description

API documentation for the Library Management System. This system provides a comprehensive solution for managing a library's collection of books, user reservations, and authentication processes.

## Features

- **Books Management**: Add, update, delete, and search for books in the library's collection.
- **User Management**: Register new users, update user information, and manage user roles.
- **Reservations**: Users can reserve books, view their reservations, and manage their borrowing activities.
- **Authentication and Authorization**: Secure login and signup processes with JWT-based authentication and role-based access control.
- **Rate Limiting**: Protect the API from brute-force attacks by limiting the number of requests per minute.

## Security

- All endpoints with the exception of `GET /books` are secured with JWT authentication.
- Role-based access control ensures that only authorized users can access certain endpoints.
- Rate Limiting.
- CORS.
- Helmet.

## How to Use

1. **Clone the repository**

    ```bash
    git clone https://github.com/guabriola/Reto-2-Biblioteca-Nest.git
    ```

2. **Create a new Database (MySQL)**

    ```sql
    CREATE DATABASE name_of_your_new_database;
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

4. **Create a `.env` File in the root folder of the project with your data**

    ```env
    # MYSQL DATABASE
    HOST=localhost
    PORT=3306
    DB_USER=db_user
    PASSWORD=db_password
    DATABASE=name_of_your_new_database

    # Encrypted password for JWT 
    # You can use a not encrypted password for testing.

    JWT_SECRET=N8b+BEuw2YTko+L1RnKNPwHq4dgm622fqGSp0H++RYU=y

    # FIRST ADMIN USER
    # This is the data for the first admin user that you can change if you want.
    # You can change the password here or later. Any one you choose it will be encrypted.

    ADMIN_EMAIL=admin@admin.com
    ADMIN_PASSWORD=12345
    ADMIN_NAME=ADMIN
    ADMIN_LAST_NAME=ADMIN
    ```

5. **Running the app**

    - **Development**

      ```bash
      npm run start
      ```

    - **Watch mode**

      ```bash
      npm run start:dev
      ```

    - **Production mode**

      ```bash
      npm run start:prod
      ```
6. **Documentation**

    - **Swagger BROWSER**
      ```bash
      http://localhost:3000/swagger
      ```
    - **Swagger JSON**
      ```bash
      http://localhost:3000/swagger/json
      ```

## Test (Not implemented yet)

- **Unit tests**

    ```bash
    npm run test
    ```

- **e2e tests**

    ```bash
    npm run test:e2e
    ```

- **Test coverage**

    ```bash
    npm run test:cov
    ```

## Stay in touch

- **Author** - [Guillermo Abriola](https://www.linkedin.com/in/guillermo-abriola/)
- **GitHub** - [https://github.com/guabriola](https://github.com/guabriola)

## Enjoy using the Library Management System API!