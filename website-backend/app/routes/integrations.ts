// SPDX-License-Identifier: Apache-2.0
import express from 'express';

const App = express();

App.use('/i', require('./integrations/bigcommerce'));

module.exports = App;