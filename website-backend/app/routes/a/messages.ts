// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/reprocess_submission/', require('./messages/reprocess_submission'));

module.exports = App;
