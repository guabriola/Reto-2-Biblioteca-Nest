import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';

describe('Auth Integration Tests', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Obtener la instancia de DataSource para SQLite en memoria
    dataSource = app.get<DataSource>(getDataSourceToken());
    await dataSource.synchronize(true); // Sincronizar la base de datos antes de todas las pruebas
  });

  afterAll(async () => {
    if (dataSource.isInitialized) {
      await dataSource.destroy(); // Cerrar la conexión después de todas las pruebas
    }
    await app.close();
  });

  beforeEach(async () => {
    await dataSource.synchronize(true); // Reiniciar la base de datos antes de cada prueba
  });

  it('/auth/signup (POST) - should sign up a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'testpassword',
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('/auth/login (POST) - should log in and return a JWT token', async () => {
    // First sign up a user
    await request(app.getHttpServer())
      .post('/auth/signup')
      .send({
        username: 'testuser',
        password: 'testpassword',
      });

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: 'testuser',
        password: 'testpassword',
      })
      .expect(200);

    expect(response.body).toHaveProperty('access_token');
  });
});