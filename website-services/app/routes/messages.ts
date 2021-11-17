// SPDX-License-Identifier: Apache-2.0
import express = require('express');
const app = express();

app.use('/create_project', require('./messages/create_project'));
app.use('/grab_icon', require('./messages/grab_icon'));
app.use('/mark_message_complete', require('./messages/mark_message_complete'));
app.use('/mark_message_failed', require('./messages/mark_message_failed'));
app.use('/move_reference_photos', require('./messages/move_reference_photos'));
app.use('/queue', require('./messages/queue'));
app.use('/reprocess_submission', require('./messages/reprocess_submission'));
app.use('/unzip_project', require('./messages/unzip_project'));
app.use('/zip_project', require('./messages/zip_project'));

module.exports = app;
