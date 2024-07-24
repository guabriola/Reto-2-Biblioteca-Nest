import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import helmet from 'helmet';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(helmet()); // Activate all Helmet protections
  app.setGlobalPrefix('api-lib/v1');
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000/', // Alowed domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  //Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Reto-2 DigitalNao - Library Booking ')
    .setDescription(`
      API documentation for the Library Management System. 
      This system provides a comprehensive solution for managing a library's collection of books, user reservations, and authentication processes.
  
      ##Features
  
      - **Books Management**: Add, update, delete, and search for books in the library's collection.
      - **User Management**: Register new users, update user information, and manage user roles.
      - **Reservations**: Users can reserve books, view their reservations, and manage their borrowing activities.
      - **Authentication and Authorization**: Secure login and signup processes with JWT-based authentication and role-based access control.
      - **Rate Limiting**: Protect the API from brute-force attacks by limiting the number of requests per minute.
  
      ## Security
  
      - All endpoints with exception of GET/books are secured with JWT authentication.
      - Role-based access control ensures that only authorized users can access certain endpoints.
      - Rate Limiting.
      - CORS.
      - Helmet.
  
      ## How to Use
  
      - Use the provided endpoints to interact with the library system.
      - Ensure you are authenticated by providing a valid JWT token in the Authorization header for protected endpoints.
      - Follow the rate limits to avoid being blocked.
      
      ##Library booking repository
      https://github.com/guabriola/Reto-2-Biblioteca-Nest.git
      
      Enjoy using the Library Management System API!
    `)
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'swagger/json',  
  });
  await app.listen(3000);
}
bootstrap();
