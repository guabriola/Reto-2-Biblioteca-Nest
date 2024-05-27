import { TypeOrmModuleOptions } from '@nestjs/typeorm'; 

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach(k => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions { 
    return {
      type: 'mysql', 

      host: this.getValue('HOST'), 
      port: parseInt(this.getValue('PORT')),
      username: this.getValue('DB_USER'),
      password: this.getValue('PASSWORD'),
      database: this.getValue('DATABASE'),

      entities: ['dist/**/*.entity.js'], 
      synchronize: true, 
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'HOST',
  'PORT',
  'DB_USER',
  'PASSWORD',
  'DATABASE',
]);

export { configService };
