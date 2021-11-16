// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/favorites/', require('./search/favorites'));
App.use('/products/', require('./search/products'));

module.exports = App;
