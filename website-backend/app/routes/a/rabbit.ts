// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/queue_message/', require('./rabbit/queue_message'));
App.use('/queue_message_internal/', require('./rabbit/queue_message_internal'));
App.use('/status/', require('./rabbit/status'));

module.exports = App;
