// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/set_primary_role/', require('./account/set_primary_role'));

module.exports = App;
