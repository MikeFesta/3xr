// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/answered/', require('./faq/answered'));
App.use('/ask_question/', require('./faq/ask_question'));
App.use('/my_questions/', require('./faq/my_questions'));

module.exports = App;
