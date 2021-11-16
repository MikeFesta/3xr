// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/artist_picklist/', require('./studio/artist_picklist'));
App.use('/billing/', require('./studio/billing'));

module.exports = App;
