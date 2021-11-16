// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/brand_picklist/', require('./client/brand_picklist'));
App.use('/class_picklist/', require('./client/class_picklist'));
App.use('/client_studios/', require('./client/client_studios'));
App.use('/delete_brand/', require('./client/delete_brand'));
App.use('/delete_class/', require('./client/delete_class'));
App.use('/details/', require('./client/details'));
App.use('/new_brand/', require('./client/new_brand'));
App.use('/new_class/', require('./client/new_class'));
App.use('/users/', require('./client/users'));

module.exports = App;
