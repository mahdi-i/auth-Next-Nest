import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export default new DataSource({
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
  type: 'postgres',
  entities: ['dist/**/**/**/*.entity{.ts,.js}', 'dist/**/**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  dropSchema: false,
  logging: false,
  logger: 'file',
});
