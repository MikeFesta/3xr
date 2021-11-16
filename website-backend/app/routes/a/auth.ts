// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/', require('./auth/oauth'));

module.exports = App;
