// SPDX-License-Identifier: Apache-2.0
import express = require('express');
const App = express();

App.use('/details/', require('./material/details'));
App.use('/link_product/', require('./material/link_product'));
App.use('/new/', require('./material/new'));
App.use('/search/', require('./material/search'));
App.use('/unlink_product/', require('./material/unlink_product'));

module.exports = App;
