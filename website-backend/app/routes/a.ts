// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Passport from 'passport';
import bigCommerceApi from './bigcommerce/api';

const App = express();

App.use('/addon/', require('./a/addon'));
App.use('/admin/', require('./a/admin'));
App.use('/asset/', require('./a/asset'));
App.use('/auth/', require('./a/auth'));
App.use('/bigcommerce/', Passport.authenticate('bearer'), bigCommerceApi);
App.use('/blender/', require('./a/blender'));
App.use('/client/', require('./a/client'));
App.use('/contact_us/', require('./a/contact_us'));
App.use('/faq/', require('./a/faq'));
App.use('/help/', require('./a/help'));
App.use('/job/', require('./a/job'));
App.use('/material/', require('./a/material'));
App.use('/messages/', require('./a/messages'));
App.use('/part/', require('./a/part'));
App.use('/picklist/', require('./a/picklist'));
App.use('/product/', require('./a/product'));
App.use('/project/', require('./a/project'));
App.use('/rabbit/', require('./a/rabbit'));
App.use('/search/', require('./a/search'));
App.use('/studio/', require('./a/studio'));
App.use('/submission/', require('./a/submission'));
App.use('/types/', require('./a/types'));
App.use('/user/', require('./a/user'));

module.exports = App;
