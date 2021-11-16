// SPDX-License-Identifier: Apache-2.0
'use strict';
const AMQP = require('amqplib/callback_api');
const ChildProcess = require('child_process');
const ChildPromise = require('./child_promise');
const RabbitMessage = require('./rabbit_message');

module.exports = class ConsumeQueue {
  constructor(queue_name, script_to_run, getScriptArguments) {
    this.queue_name = queue_name;
    this.script_to_run = script_to_run;
    this.getScriptArguments = getScriptArguments;
  }

  run() {
    const queue_name = this.queue_name;
    const script_to_run = this.script_to_run;
    const getScriptArguments = this.getScriptArguments;
    AMQP.connect(
      {
        protocol: 'amqp',
        hostname: 'REDACTED',
        port: 5672,
        username: 'REDACTED',
        password: 'REDACTED',
        vhost: 'REDACTED',
      },
      function (error0, connection) {
        if (error0) {
          console.log("ERROR 0");
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            console.log("ERROR 1");
            throw error1;
          }

          channel.assertQueue(queue_name, {
            durable: true
          });

          console.log('Waiting for messages in %s. To exit press CTRL+C', queue_name);
          channel.prefetch(1);
          channel.consume(queue_name, function (msg) {
            console.log('Received %s', msg.content.toString());
            let rabbit_message_id = 0;
            try {
              rabbit_message_id = JSON.parse(msg.content).rabbit_message_id;
              const prc = ChildProcess.execFile(
                script_to_run,
                getScriptArguments(JSON.parse(msg.content)),
              );
              prc.stdout.on("data", data => {
                console.log(data);
              });
              prc.stderr.on("data", err => {
                console.log('ERROR');
                console.log(err);
                prc.failed = true;
              });
              ChildPromise.fromProcess(prc)
                .then(output => {
                  channel.ack(msg);
                  if (prc.failed) {
                    // This fails sometimes without hitting stderr, not sure why
                    RabbitMessage.markFailed(rabbit_message_id, 'Execution Failed');
                  } else {
                    RabbitMessage.markComplete(rabbit_message_id);
                  }
                })
                .catch(err => {
                  channel.ack(msg); // prevent failure loop
                  RabbitMessage.markFailed(rabbit_message_id, 'Exception running subprocess');
                });
            } catch (err) {
              channel.ack(msg);
              console.log('General Exception:');
              console.log(err);
              RabbitMessage.markFailed(rabbit_message_id, 'General exception');
            }
          }, {
            // Require an acknowledgement so that messages are not lost
            noAck: false
          });
        });
      }
    );
  }
}
