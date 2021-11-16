// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/delete/', require('./issue/delete'));
App.use('/issues_by_category/', require('./issue/issues_by_category'));
App.use('/new/', require('./issue/new'));
App.use('/open/', require('./issue/open'));
App.use('/resolve/', require('./issue/resolve'));
App.use('/resolved/', require('./issue/resolved'));
App.use('/update/', require('./issue/update'));

module.exports = App;
