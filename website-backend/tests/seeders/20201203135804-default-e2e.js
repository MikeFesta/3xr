'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // populate database with user and data for lookup tables

    await queryInterface.bulkInsert('users', [
      {
        username: 'e2e-client',
        email: 'e2e@test.com',
        hash: '$2a$10$sUcJWVI0sbDB1OXnvfTW2.YKA5Oxs6mwHG674RHIWwjZXvsiWWVVG', // j46B3WEDXv5S
        admin: false,
        first_name: 'e2e',
        last_name: 'e2e',
        created_at: new Date(),
        updated_at: new Date(),
        artist: false,
        primary_role_id: 2,
        email_notifications: false,
      },
    ]);
    await queryInterface.bulkInsert('clients', [
      {
        id: 1,
        uid: 'uid',
        name: 'E2E Client',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('user_clients', [
      {
        user_id: 1,
        client_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('oauth_clients', [
      {
        client_id: 'foobar',
        client_secret: 'supersecret!',
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
    await queryInterface.bulkInsert('notification_read_status_types', [
      { id: 1, name: 'pending' },
      { id: 2, name: 'done' },
      { id: 3, name: 'deleted' },
    ]);
    await queryInterface.bulkInsert('notification_types', [
      { id: 1, name: 'job' },
      { id: 2, name: 'project_created' },
      { id: 3, name: 'job_comment_added_artist' },
      { id: 4, name: 'job_comment_added_client' },
      { id: 5, name: 'purchase_order' },
    ]);
    await queryInterface.bulkInsert('file_types', [
      { id: 1, name: 'Reference Image', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Render (jpg)', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Render (png)', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'Model (USDZ)', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'Model (GLB)', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'QR Code', created_at: new Date(), updated_at: new Date() },
      { id: 7, name: '360 Spin Image', created_at: new Date(), updated_at: new Date() },
      { id: 8, name: '360 Spin (gif)', created_at: new Date(), updated_at: new Date() },
      { id: 9, name: '360 Spin Video', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('job_comment_types', [
      { id: 1, name: 'Artist', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Job', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('project_status_types', [
      { id: 1, name: 'Unsubmitted', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'In Progress', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Complete', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'Cancelled', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'Pending', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'Submitted 25 percent', created_at: new Date(), updated_at: new Date() },
      { id: 7, name: 'Submitted 50 percent', created_at: new Date(), updated_at: new Date() },
      { id: 8, name: 'Submitted 75 percent', created_at: new Date(), updated_at: new Date() },
      { id: 9, name: 'Submitted 100 percent', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('texture_types', [
      { id: 1, name: 'ao', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'clearcoat', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'clearcoat_roughness', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'diffuse', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'emissive', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'metallic', created_at: new Date(), updated_at: new Date() },
      { id: 7, name: 'normal', created_at: new Date(), updated_at: new Date() },
      { id: 8, name: 'roughness', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('file_extension_types', [
      { id: 1, name: 'jpg', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'png', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'glb', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'usdz', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: 'blend', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'zip', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('user_agreement_types', [{ id: 1, name: 'privacy_policy_and_terms_of_service' }]);
    await queryInterface.bulkInsert('user_agreements', [{ id: 1, user_agreement_type_id: 1, version: 1 }]);
    await queryInterface.bulkInsert('user_agreement_responses', [
      { id: 1, user_agreement_id: 1, user_id: 1, response: true, created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('roles', [
      { id: 1, name: 'artist', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'client', created_at: new Date(), updated_at: new Date() },

      { id: 3, name: 'admin', created_at: new Date(), updated_at: new Date() },

      { id: 4, name: 'qa', created_at: new Date(), updated_at: new Date() },
    ]);

    await queryInterface.bulkInsert('user_roles', [
      { user_id: 1, role_id: 2, created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('client_brands', [
      { id: 1, client_id: 1, deleted: false, name: 'TEST BRAND', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('client_classes', [
      { id: 1, client_id: 1, deleted: false, name: 'TEST CLASS', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('job_status_types', [
      { id: 1, name: 'Unassigned', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Assigned', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'In Progress', created_at: new Date(), updated_at: new Date() },
      { id: 4, name: 'Modeler QA', created_at: new Date(), updated_at: new Date() },
      { id: 5, name: '3XR QA', created_at: new Date(), updated_at: new Date() },
      { id: 6, name: 'Revision Needed', created_at: new Date(), updated_at: new Date() },
      { id: 7, name: 'In Rework', created_at: new Date(), updated_at: new Date() },
      { id: 8, name: 'Client QA', created_at: new Date(), updated_at: new Date() },
      { id: 9, name: 'Complete', created_at: new Date(), updated_at: new Date() },
      { id: 10, name: 'Cancelled', created_at: new Date(), updated_at: new Date() },
      { id: 11, name: 'Awaiting Rework for Client', created_at: new Date(), updated_at: new Date() },
      { id: 12, name: 'In Client Rework', created_at: new Date(), updated_at: new Date() },
      { id: 13, name: 'Awaiting Client Re-review', created_at: new Date(), updated_at: new Date() },
      { id: 14, name: 'Complete', created_at: new Date(), updated_at: new Date() },
      { id: 15, name: 'Cancelled', created_at: new Date(), updated_at: new Date() },
      { id: 16, name: 'Pending Review', created_at: new Date(), updated_at: new Date() },
    ]);
    await queryInterface.bulkInsert('unit_types', [
      { id: 1, name: 'Meters', created_at: new Date(), updated_at: new Date() },
      { id: 2, name: 'Inches', created_at: new Date(), updated_at: new Date() },
      { id: 3, name: 'Centimeters', created_at: new Date(), updated_at: new Date() },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    // not needed since docker will build fresh postgres every time
  },
};
