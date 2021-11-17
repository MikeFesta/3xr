// SPDX-License-Identifier: Apache-2.0
import Express = require('express');
const App = Express();

App.use('/pull', require('./sync/pull'));

module.exports = App;
