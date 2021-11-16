// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { internalOnlyFilter } from '@access/internal_only';
import { RabbitMessage } from '@models/rabbit_message';
import { RabbitMessageStatusTypeEnum } from '@enums';
import Errors from '@root/errors';
const RequestPromise = require('request-promise');
const Router = express.Router();

Router.post(
  '/',
  internalOnlyFilter, // Primary difference between queue_message.ts
  (req: express.Request, res: express.Response) => {
    const jsonData = JSON.parse(req.body.data);
    let rabbitMessageId = 0;
    RequestPromise({
      method: 'POST',
      uri: 'https://x.3xr.com/messages/queue',
      form: {
        data: JSON.stringify(jsonData),
        queue: req.body.queue,
        userId: 21, // Hard coded user id for the 3XR System
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
