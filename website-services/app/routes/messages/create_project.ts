// SPDX-License-Identifier: Apache-2.0
import amqp from 'amqplib/callback_api';
import Express from 'express';
const Router = Express.Router();

Router.post('/', (req: Express.Request, res: Express.Response) => {
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
        var queue = 'create_project';
        var msg =
          '{"name": "' +
          req.body.name +
          '", "uid": "' +
          req.body.uid +
          '", "height": "' +
          req.body.height +
          '", "width": "' +
          req.body.width +
          '", "depth": "' +
          req.body.depth +
          '"}';
        channel.assertQueue(queue, {
          durable: true,
        });
        channel.sendToQueue(queue, Buffer.from(msg));
        res.json({ message: msg, from: req.ip });
      });
      setTimeout(function () {
        // Close the connection after the message is sent
        connection.close();
        //res.json({message: 'Connection Timeout', from: req.ip});
      }, 500);
    },
  );
});
module.exports = Router;
