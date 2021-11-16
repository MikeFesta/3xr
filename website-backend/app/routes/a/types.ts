// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/asset_issue/', require('./types/asset_issue'));
App.use('/asset_issue_category/', require('./types/asset_issue_category'));

module.exports = App;
