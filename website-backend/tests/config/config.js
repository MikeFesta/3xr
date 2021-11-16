module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'db3xr',
    host: process.env.DB_URL || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    define: {
      charset: 'utf8',
      underscored: true,
      underscore: true,
      underscoredAll: true,
    },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
};
