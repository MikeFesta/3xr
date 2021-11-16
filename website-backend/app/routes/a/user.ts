// SPDX-License-Identifier: Apache-2.0
import express from 'express';

const App = express();

App.use('/api_token/', require('./user/api_token'));
App.use('/artist_picklist/', require('./user/artist_picklist'));
App.use('/check_login/', require('./user/check_login'));
App.use('/client/', require('./user/client'));
App.use('/clients/', require('./user/clients'));
App.use('/details/', require('./user/details'));
App.use('/forgot_password/', require('./user/forgot_password'));
App.use('/generate_api_token/', require('./user/generate_api_token'));
App.use('/invalid_login/', require('./user/invalid_login'));
App.use('/login_with_password/', require('./user/login_with_password'));
App.use('/login_with_token/', require('./user/login_with_token'));
App.use('/login/', require('./user/login'));
App.use('/logout/', require('./user/logout'));
App.use('/my_info/', require('./user/my_info'));
App.use('/notifications/', require('./user/notifications'));
App.use('/set_password_from_reset/', require('./user/set_password_from_reset'));
App.use('/settings/', require('./user/settings'));
App.use('/signup/', require('./user/signup'));
App.use('/studios/', require('./user/studios'));
App.use('/unauthorized/', require('./user/unauthorized'));
App.use('/update/', require('./user/update'));
App.use('/user_agreements/', require('./user/user_agreements'));
App.use('/username_for_reset_token/', require('./user/username_for_reset_token'));

module.exports = App;
