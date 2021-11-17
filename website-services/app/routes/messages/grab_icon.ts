// SPDX-License-Identifier: Apache-2.0
import amqp from 'amqplib/callback_api';
import Express from 'express';
import Log from '@root/log';
const Router = Express.Router();

Router.post('/', (req: Express.Request, res: Express.Response) => {
  if (req.ip != 'REDACTED') {
    Log.error('Grab Icon request rejected from ' + req.id);
    res.json('Invalid Request');
  } else {
    amqp.connect(
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
          throw error0;
        }
        connection.createChannel(function (error1, channel) {
          if (error1) {
            throw error1;
          }
          var queue = 'grab_icon';
          var msg =
            '{"name": "' + req.body.name + '", "id":"' + req.body.id + '"}';
          channel.assertQueue(queue, {
            durable: true,
          });
          channel.sendToQueue(queue, Buffer.from(msg));
          res.json({
            status: 'Grab icon message sent',
            message: msg,
            from: req.ip,
          });
        });
        setTimeout(function () {
          // Close the connection after the message is sent
          connection.close();
        }, 500);
      },
    );
  }
});
module.exports = Router;
