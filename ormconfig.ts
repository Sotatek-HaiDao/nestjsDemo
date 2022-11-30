/* eslint-disable @typescript-eslint/no-var-requires */
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const SnakeNamingStrategy = require('typeorm-naming-strategies').SnakeNamingStrategy;

module.exports = {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || '3306',
  username: process.env.DB_USERNAME || '',
  password: process.env.DB_PASSWORD || '',
  type: process.env.DB_CONNECTION || 'mysql',
  database: process.env.DB_DATABASE || '',
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  migrations: ['dist/src/database/migrations/*.js'],
  factories: ['dist/src/database/factories/*.factory{.ts,.js}'],
  seeds: ['dist/src/database/seeders/*.js'],
  namingStrategy: new SnakeNamingStrategy(),
  autoLoadEntities: true,
  cli: {
    entitiesDir: 'src',
    subscribersDir: 'src',
    migrationsDir: 'src/database/migrations',
  },
};
