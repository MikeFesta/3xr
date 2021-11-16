// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/approve_client/', require('./submission/approve_client'));
App.use('/approve_technical/', require('./submission/approve_technical'));
App.use('/cancel/', require('./submission/cancel'));
App.use('/details/', require('./submission/details'));
App.use('/hotspots/', require('./submission/hotspots'));
App.use('/issue/', require('./submission/issue'));
App.use(
  '/needs_technical_revision/',
  require('./submission/needs_technical_revision'),
);
App.use('/record_render/', require('./submission/record_render'));
App.use('/record_renders/', require('./submission/record_renders'));
App.use('/set_status/', require('./submission/set_status'));
App.use('/start_review/', require('./submission/start_review'));
App.use('/submit_for_qa/', require('./submission/submit_for_qa'));

module.exports = App;
