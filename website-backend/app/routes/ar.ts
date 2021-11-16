// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/metrics', require('./ar/metrics'));

module.exports = App;
