// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const App = express();

App.use('/assign_artist/', require('./product/assign_artist'));
App.use('/blender_details/', require('./product/blender_details'));
App.use('/delete_additional_file/', require('./product/delete_additional_file'));
App.use('/delete_reference_image/', require('./product/delete_reference_image'));
App.use('/details/', require('./product/details'));
App.use('/dropdowns/', require('./product/dropdowns'));
App.use('/favorites/', require('./product/favorites'));
App.use('/file_upload_complete/', require('./product/file_upload_complete'));
App.use('/image_upload_complete/', require('./product/image_upload_complete'));
App.use('/ready_to_submit/', require('./product/ready_to_submit'));
App.use('/record_zip_download/', require('./product/record_zip_download'));
App.use('/search/', require('./product/search'));
App.use('/set_favorite/', require('./product/set_favorite'));
App.use('/set_primary_reference_image/', require('./product/set_primary_reference_image'));
App.use('/submit/', require('./product/submit'));
App.use('/unity_qa_list/', require('./product/unity_qa_list'));

module.exports = App;
