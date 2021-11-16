// SPDX-License-Identifier: Apache-2.0
import express = require('express');
const App = express();

App.use('/asset_details_with_submissions/', require('./asset/asset_details_with_submissions'));
App.use('/asset_details/', require('./asset/asset_details'));
App.use('/banner/', require('./asset/banner'));
App.use('/details_for_unity/', require('./asset/details_for_unity'));
App.use('/qa_details/', require('./asset/qa_details'));
App.use('/record_spin_set/', require('./asset/record_spin_set'));
App.use('/search/', require('./asset/search'));
App.use('/set_has360/', require('./asset/set_has360'));
App.use('/set_published/', require('./asset/set_published'));
App.use('/set_submission_dimensions/', require('./asset/set_submission_dimensions'));
App.use('/set_submission_status/', require('./asset/set_submission_status'));
App.use('/verify_file_uploads/', require('./asset/verify_file_uploads'));

module.exports = App;
