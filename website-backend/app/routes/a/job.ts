// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/create_or_update/', require('./job/create_or_update'));
App.use('/delete/', require('./job/delete_job'));
App.use('/daily_deadline_snapshot/', require('./job/daily_deadline_snapshot'));
App.use('/daily_status_snapshot/', require('./job/daily_status_snapshot'));
App.use('/deadline_status/', require('./job/deadline_status'));
App.use('/job_details/', require('./job/job_details'));
App.use('/job_search/', require('./job/job_search'));
App.use('/my_jobs/', require('./job/my_jobs'));
App.use('/preview/', require('./job/preview'));
App.use('/set_status/', require('./job/set_status'));
App.use('/status_count/', require('./job/status_count'));
App.use('/status_snapshot/', require('./job/status_snapshot'));
App.use('/:jobUid/comments/', require('./job/comment'));

module.exports = App;
