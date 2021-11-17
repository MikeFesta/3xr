// SPDX-License-Identifier: Apache-2.0
import Express = require('express');
const App = Express();

App.use(
  '/asset_submission_issue_images',
  require('./upload/asset_submission_issue_images'),
);
App.use(
  '/create_asset_with_six_images',
  require('./upload/create_asset_with_six_images'),
);
App.use(
  '/product_reference_images',
  require('./upload/product_reference_images'),
);
App.use(
  '/product_additional_files',
  require('./upload/product_additional_files'),
);
App.use(
  '/project_resources_zip',
  require('./upload/project_resources_zip'),
);
App.use('/submit_assignment', require('./upload/submit_assignment'));
App.use('/submit_product', require('./upload/submit_product'));

module.exports = App;
