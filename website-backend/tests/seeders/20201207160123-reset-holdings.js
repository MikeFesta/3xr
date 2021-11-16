'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('DELETE FROM project_holdings;');
    await queryInterface.sequelize.query('DELETE FROM product_holdings;');
    await queryInterface.sequelize.query('DELETE FROM products;');
    await queryInterface.sequelize.query('DELETE FROM product_holding_reference_images;');
    await queryInterface.sequelize.query('DELETE FROM jobs;');

    return true;
  },

  down: async (queryInterface, Sequelize) => {},
};
