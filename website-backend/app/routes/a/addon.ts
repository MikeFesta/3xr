// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/check_for_update/', require('./addon/check_for_update'));
App.use('/insert_version/', require('./addon/insert_version'));

module.exports = App;
