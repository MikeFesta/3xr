// SPDX-License-Identifier: Apache-2.0
import express from 'express';

const App = express();

App.use('/view', require('./asset/view'));

module.exports = App;
