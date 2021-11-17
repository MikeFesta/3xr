// SPDX-License-Identifier: Apache-2.0
import Sequelize from 'sequelize';
const connectionString = 'REDACTED';

export default new Sequelize(connectionString, {
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
