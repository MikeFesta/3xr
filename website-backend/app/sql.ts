// SPDX-License-Identifier: Apache-2.0
import { Sequelize } from 'sequelize';
require('dotenv').config();

const connectionString = `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_URL}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

export const sql = new Sequelize(connectionString, {
  define: {
    charset: 'utf8',
    underscored: true,
  },
  dialect: 'postgres',
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

export default sql;
