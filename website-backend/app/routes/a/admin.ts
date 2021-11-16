// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/account/', require('./admin/account'));
App.use('/client/', require('./admin/client'));
App.use('/heartbeat/', require('./admin/heartbeat'));
App.use('/jobs_needing_technical_qa/', require('./admin/jobs_needing_technical_qa'));
App.use('/latest_submission/', require('./admin/latest_submission'));
App.use('/looking_glass/', require('./admin/looking_glass'));
App.use('/project/', require('./admin/project'));
App.use('/studio/', require('./admin/studio'));
App.use('/uid/', require('./admin/uid'));
App.use('/user/', require('./admin/user'));

module.exports = App;
