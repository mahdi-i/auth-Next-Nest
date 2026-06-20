import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();
const dataSource = new DataSource({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  type: 'postgres',
  entities: [
    'src/typeorm/entities/**/*.ts',
    'src/**/*.entity.ts',
    'dist/typeorm/entities/**/*.js',
    'dist/**/*.entity.js',
  ],
  migrations: [
    'src/typeorm/migrations/**/*.ts',
    'dist/typeorm/migrations/**/*.js',
  ],
  synchronize: false,
  migrationsRun: true,
  dropSchema: false,
  logging: true,
  logger: 'file',
});
export default dataSource;
