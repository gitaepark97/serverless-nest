import dotenv from 'dotenv';
import { DataSource } from 'typeorm';

dotenv.config({
  path: `.env.${process.env.NODE_ENV}`,
});

console.log(process.env.MARIADB_HOST);

const buildDataSource = new DataSource({
  type: 'mariadb',
  host: process.env.MARIADB_HOST,
  port: parseInt(process.env.MARIADB_PORT),
  username: process.env.MARIADB_USERNAME,
  password: process.env.MARIADB_PASSWORD,
  database: process.env.MARIADB_DATABASE,
  entities: ['dist/src/entities/*.js'],
  migrations: ['dist/db/migrations/*.js'],
  logging: true,
});

export default buildDataSource;
