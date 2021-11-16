// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/asset_complexity_type/', require('./picklist/asset_complexity_type'));

module.exports = App;
