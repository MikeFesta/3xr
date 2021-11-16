// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/clients/', require('./user/clients'));
App.use('/edit/', require('./user/edit'));
App.use('/link_client/', require('./user/link_client'));
App.use('/link_studio/', require('./user/link_studio'));
App.use('/new/', require('./user/new'));
App.use('/search/', require('./user/search'));
App.use('/studios/', require('./user/studios'));
App.use('/unlink_client/', require('./user/unlink_client'));
App.use('/unlink_studio/', require('./user/unlink_studio'));

module.exports = App;
