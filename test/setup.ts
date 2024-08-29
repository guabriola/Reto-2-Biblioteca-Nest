import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

declare const app: INestApplication; 

let dataSource: DataSource;

beforeEach(async () => {
  dataSource = app.get<DataSource>(getDataSourceToken());
  await dataSource.synchronize(true);  // Reset DB before every test
});

afterAll(async () => {
  if (dataSource.isInitialized) {
    await dataSource.destroy();  // Closes de DB conect
  }
});