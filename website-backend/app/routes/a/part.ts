// SPDX-License-Identifier: Apache-2.0
import express = require('express');
const App = express();

App.use('/add_slot/', require('./part/add_slot'));
App.use('/details/', require('./part/details'));
App.use('/link_product/', require('./part/link_product'));
App.use('/new/', require('./part/new'));
App.use('/remove_slot/', require('./part/remove_slot'));
App.use('/search/', require('./part/search'));
App.use('/unlink_product/', require('./part/unlink_product'));
App.use('/update_from_submission/', require('./part/update_from_submission'));

module.exports = App;
