// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/client_details/', require('./client/client_details'));
App.use('/client_picklist/', require('./client/client_picklist'));
App.use('/client_studios/', require('./client/client_studios'));
App.use('/cb_weekly_completed_list/', require('./client/cb_weekly_completed_list'));
App.use('/edit_client/', require('./client/edit_client'));
App.use('/link_studio/', require('./client/link_studio'));
App.use('/new/', require('./client/new'));
App.use('/search/', require('./client/search'));
App.use('/unlink_studio/', require('./client/unlink_studio'));

module.exports = App;
