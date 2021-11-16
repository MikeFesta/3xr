// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/client_holdings/', require('./project/client_holdings'));
App.use('/create_holding', require('./project/create_holding'));
App.use('/create_project/', require('./project/create_project'));
App.use('/delete/', require('./project/delete'));
App.use('/details/', require('./project/details'));
App.use('/jobs/', require('./project/jobs'));
App.use('/my_projects/', require('./project/my_projects'));
App.use('/populate_from_csv/', require('./project/populate_from_csv'));
App.use('/project_picklist/', require('./project/project_picklist'));
App.use('/resources_template_zip/', require('./project/resources_template_zip'));
App.use('/resources_upload_complete/', require('./project/resources_upload_complete'));
App.use('/submit/', require('./project/submit'));
App.use('/update_project/', require('./project/update_project'));

module.exports = App;
