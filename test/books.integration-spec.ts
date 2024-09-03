import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource, Repository } from 'typeorm';
import { getDataSourceToken, getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/users/entities/user.entity';
import { Book } from '../src/books/entities/book.entity';
import { Role } from '../src/roles/entities/role.entity';

describe('Books Integration Tests', () => {
    let app: INestApplication;
    let dataSource: DataSource;
    let userRepository: Repository<User>;
    let bookRepository: Repository<Book>;
    let rolesRepository: Repository<Role>;
    let jwtTokenAdmin: string;
    let jwtTokenUser: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();

        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }));

        await app.init();

        dataSource = app.get<DataSource>(getDataSourceToken());
        userRepository = dataSource.getRepository(User);
        bookRepository = dataSource.getRepository(Book);
        rolesRepository = dataSource.getRepository(Role);

        // Limpiar las tablas antes de las pruebas
        await rolesRepository.query('DELETE FROM role');
        await bookRepository.query('DELETE FROM book');
        await userRepository.query('DELETE FROM user');

        // Crear y guardar roles
        const roleAdmin = await rolesRepository.save({ role: 'ADMIN' });
        const roleUser = await rolesRepository.save({ role: 'USER' });

        // Crear un usuario administrador
        const adminUserResponse = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                username: 'adminuser',
                email: 'adminuser@gmail.com',
                password: 'Admin123!',
                name: 'Admin',
                lastName: 'User',
            })
            .expect(201);

        let adminUser = await userRepository.findOne({ where: { username: 'adminuser' }, relations: ['roles'] });
        if (adminUser) {
            adminUser.roles = [roleAdmin];
            await userRepository.save(adminUser);
        }

        // Iniciar sesión como administrador para obtener el token JWT
        const loginAdminResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                username: 'adminuser',
                password: 'Admin123!',
            })
            .expect(200);

        jwtTokenAdmin = loginAdminResponse.body.access_token;

        // Crear un usuario regular
        const regularUserResponse = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                username: 'regularuser',
                email: 'regularuser@gmail.com',
                password: 'User123!',
                name: 'Regular',
                lastName: 'User',
            })
            .expect(201);

        let regularUser = await userRepository.findOne({ where: { username: 'regularuser' }, relations: ['roles'] });
        if (regularUser) {
            regularUser.roles = [roleUser];
            await userRepository.save(regularUser);
        }

        // Iniciar sesión como usuario regular para obtener el token JWT
        const loginUserResponse = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                username: 'regularuser',
                password: 'User123!',
            })
            .expect(200);

        jwtTokenUser = loginUserResponse.body.access_token;
    });

    afterAll(async () => {
        if (dataSource && dataSource.isInitialized) {
            await dataSource.destroy();
        }
        await app.close();
    });

    describe('Public Access - List Books', () => {
        it('/books (GET) - should list all books for any user', async () => {
            await bookRepository.save([
                {
                    title: 'Book One',
                    author: 'Author One',
                    genre: 'Fiction',
                    description: 'Description for Book One',
                    publisher: 'Publisher One',
                    pages: 250,
                    image_url: 'http://example.com/book1.jpg',
                },
                {
                    title: 'Book Two',
                    author: 'Author Two',
                    genre: 'Non-Fiction',
                    description: 'Description for Book Two',
                    publisher: 'Publisher Two',
                    pages: 300,
                    image_url: 'http://example.com/book2.jpg',
                },
            ]);

            const response = await request(app.getHttpServer())
                .get('/books')
                .expect(200);

            expect(Array.isArray(response.body)).toBe(true);
            expect(response.body.length).toBeGreaterThanOrEqual(2);
        });
    });

    describe('Admin Access - Create, Update, Delete Books', () => {
        let bookId: number;

        it('/books (POST) - should allow admin to create a book', async () => {
            const response = await request(app.getHttpServer())
                .post('/books')
                .set('Authorization', `Bearer ${jwtTokenAdmin}`)
                .send({
                    title: 'New Book',
                    author: 'Author Name',
                    genre: 'Fiction',
                    description: 'A description of the book',
                    publisher: 'Publisher Name',
                    pages: 300,
                    image_url: 'http://example.com/book.jpg',
                })
                .expect(201);

            expect(response.body).toHaveProperty('id');
            expect(response.body).toHaveProperty('title', 'New Book');
            bookId = response.body.id;
        });

        it('/books/:id (PATCH) - should allow admin to update a book', async () => {
            const response = await request(app.getHttpServer())
                .patch(`/books/${bookId}`)
                .set('Authorization', `Bearer ${jwtTokenAdmin}`)
                .send({
                    title: 'Updated Book Title',
                })
                .expect(200);

            expect(response.body).toHaveProperty('id', bookId);
            expect(response.body).toHaveProperty('title', 'Updated Book Title');
        });

        it('/books/:id (DELETE) - should allow admin to delete a book', async () => {
            await request(app.getHttpServer())
                .delete(`/books/${bookId}`)
                .set('Authorization', `Bearer ${jwtTokenAdmin}`)
                .expect(204);

            const deletedBook = await bookRepository.findOne({ where: { id: bookId } });
            expect(deletedBook).toBeUndefined();
        });
    });

    describe('User Access Restrictions', () => {
        let bookId: number;

        beforeAll(async () => {
            const book = await bookRepository.save({
                title: 'User Restricted Book',
                author: 'Author Three',
                genre: 'Sci-Fi',
                description: 'Description for restricted book',
                publisher: 'Publisher Three',
                pages: 400,
                image_url: 'http://example.com/book3.jpg',
            });
            bookId = book.id;
        });

        it('/books (POST) - should not allow regular users to create a book', async () => {
            await request(app.getHttpServer())
                .post('/books')
                .set('Authorization', `Bearer ${jwtTokenUser}`)
                .send({
                    title: 'New Book by User',
                    author: 'Author Name',
                    genre: 'Fiction',
                    description: 'A description of the book',
                    publisher: 'Publisher Name',
                    pages: 300,
                    image_url: 'http://example.com/book.jpg',
                })
                .expect(403);
        });

        it('/books/:id (PATCH) - should not allow regular users to update a book', async () => {
            await request(app.getHttpServer())
                .patch(`/books/${bookId}`)
                .set('Authorization', `Bearer ${jwtTokenUser}`)
                .send({
                    title: 'Unauthorized Update',
                })
                .expect(403);
        });

        it('/books/:id (DELETE) - should not allow regular users to delete a book', async () => {
            await request(app.getHttpServer())
                .delete(`/books/${bookId}`)
                .set('Authorization', `Bearer ${jwtTokenUser}`)
                .expect(403);
        });
    });

    describe('Error Handling', () => {
        it('/books/:id (GET) - should return 404 if book not found', async () => {
            await request(app.getHttpServer())
                .get('/books/9999')
                .expect(404);
        });

        it('/books/:id (PATCH) - should return 404 if trying to update a non-existent book', async () => {
            await request(app.getHttpServer())
                .patch('/books/9999')
                .set('Authorization', `Bearer ${jwtTokenAdmin}`)
                .send({
                    title: 'Non-existent Book',
                })
                .expect(404);
        });

        it('/books/:id (DELETE) - should return 404 if trying to delete a non-existent book', async () => {
            await request(app.getHttpServer())
                .delete('/books/9999')
                .set('Authorization', `Bearer ${jwtTokenAdmin}`)
                .expect(404);
        });
    });
});
