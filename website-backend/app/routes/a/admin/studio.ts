// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/new_studio/', require('./studio/new_studio'));
App.use('/search_studios/', require('./studio/search_studios'));
App.use('/studio_picklist/', require('./studio/studio_picklist'));

module.exports = App;
