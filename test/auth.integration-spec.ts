import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

//In Setup.ts - Is the configuration for connect and disconnect DB
describe('Auth Integration Tests', () => {
    let app: INestApplication;
    let dataSource: DataSource;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        dataSource = app.get<DataSource>(getDataSourceToken());
    });

    it('/auth/signup (POST) - should sign up a new user', async () => {
        const response = await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                "username": "newuser",
                "email": "newuser@gmail.com",
                "password": "1234Aa!",
                "name": "newuser",
                "lastName": "newuser"
            })
            .expect(201);

        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('username', 'newuser');
    });

    it('/auth/login (POST) - should log in and return a JWT token', async () => {
        // First sign up a user
        await request(app.getHttpServer())
            .post('/auth/signup')
            .send({
                "username": "newuser",
                "email": "newuser@gmail.com",
                "password": "1234Aa!",
                "name": "newuser",
                "lastName": "newuser"
            });

        const response = await request(app.getHttpServer())
            .post('/auth/login')
            .send({
                "username": "newuser",
                "password": "1234Aa!",
            })
            .expect(201);

        expect(response.body).toHaveProperty('access_token');
    });
});
