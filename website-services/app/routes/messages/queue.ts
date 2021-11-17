// SPDX-License-Identifier: Apache-2.0
import amqp from 'amqplib/callback_api';
import Express from 'express';
import Log from '@root/log';
import RabbitMessage from '@models/rabbit_message';
const Router = Express.Router();

Router.post('/', (req: Express.Request, res: Express.Response) => {
  if (!['REDACTED'].includes(req.ip)) {
    // Request only allowed from 3xr servers
    Log.error('Invalid request to queue from ' + req.ip);
    res.json('Invalid Request');
  } else {
    Log.debug('Add message to queue');
    Log.debug(JSON.stringify(req.body));
    Log.debug(req.body.data);
    RabbitMessage.createForQueue(req.body.queue, req.body.userId, req.body.data)
      .then(rabbitMessage => {
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
              var message = {
                data: JSON.parse(req.body.data),
                rabbit_message_id: rabbitMessage.id,
              };
              channel.assertQueue(req.body.queue, {
                durable: true,
              });
              channel.sendToQueue(
                req.body.queue,
                Buffer.from(JSON.stringify(message)),
              );
              // TODO: snake case to camel case, need to find all callers
              res.json({
                from: req.ip,
                message: JSON.stringify(message),
                rabbit_message_id: rabbitMessage.id,
                status: 'Message sent',
              });
            });
            setTimeout(function () {
              // Close the connection after the message is sent
              connection.close();
            }, 500);
          },
        );
      })
      .catch(err => {
        Log.error('Unable to create rabbit message with queue');
        Log.error(err);
        res.json('error');
      });
  }
});
module.exports = Router;
