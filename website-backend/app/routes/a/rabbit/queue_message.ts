// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { RabbitMessage } from '@models/rabbit_message';
import { RabbitMessageStatusTypeEnum } from '@enums';
import Errors from '@root/errors';
const RequestPromise = require('request-promise');
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/user/login'),
  (req: express.Request, res: express.Response) => {
    // TODO: use RabbitMessage.sendNewMessageToQueueWithData
    let rabbitMessageId = 0;
    RequestPromise({
      method: 'POST',
      uri: 'https://x.3xr.com/messages/queue',
      form: {
        data: JSON.stringify(req.body.data),
        queue: req.body.queue,
        userId: req.user?.id,
      },
    })
      .then((xServerResult: any) => {
        rabbitMessageId = JSON.parse(xServerResult).rabbit_message_id;
        return RabbitMessage.findByPk(rabbitMessageId);
      })
      .then((rabbitMessage: any) => {
        if (rabbitMessage) {
          rabbitMessage.status_id = RabbitMessageStatusTypeEnum.SENT;
          return rabbitMessage.save();
        }
        return null;
      })
      .then((saved: any) => {
        res.json(rabbitMessageId);
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Error sending message');
      });
  },
);

module.exports = Router;
