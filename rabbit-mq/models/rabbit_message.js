// SPDX-License-Identifier: Apache-2.0
'use strict';
const RequestPromise = require('request-promise');

module.exports = class RabbitMessage {
  static markComplete(rabbit_message_id) {
    RequestPromise({
      method: 'GET',
      uri: 'https://x.3xr.com/messages/mark_message_complete/' + rabbit_message_id
    })
      .then(result => {
        console.log('Done - ' + rabbit_message_id + ' marked complete');
      })
      .catch(err => {
        channel.ack(msg); // ack the message so it doesn't get stuck in a failure loop
        console.log('Error: ' + err);
      });
  }

  static markFailed(rabbit_message_id, error_message) {
    if (rabbit_message_id) {
      RequestPromise({
        method: 'POST',
        uri: 'https://x.3xr.com/messages/mark_message_failed/' + rabbit_message_id,
        form: {
          error_message: error_message
        },
      })
        .then(result => {
          console.log('Fail - Error message ' + rabbit_message_id + ' sent');
          console.log(result);
        })
        .catch(err => {
          console.log('Error marking message as an error: ' + err);
        });
    } else {
      console.log('Unable to mark failed, no rabbit id');
    }
  }
}
