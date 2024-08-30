import { DataSource } from 'typeorm';
import { getDataSourceToken } from '@nestjs/typeorm';
import { INestApplication } from '@nestjs/common';

export function setup(app: INestApplication) {
  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = app.get<DataSource>(getDataSourceToken());
    await dataSource.synchronize(true);  // Reset DB
  });

  afterAll(async () => {
    if (dataSource && dataSource.isInitialized) {
      await dataSource.destroy();  // Close DB
    }
  });
}