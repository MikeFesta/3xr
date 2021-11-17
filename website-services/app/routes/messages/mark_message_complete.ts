// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import Log from '@root/log';
import RabbitMessage from '@models/rabbit_message';
import RabbitMessageStatusType from '@models/rabbit_message_status_type';
const Router = Express.Router();

Router.get('/:rabbitMessageId', (req: Express.Request, res: Express.Response) => {
  // These should only be marked complete internally
  if (
    !['REDACTED'].includes(
      req.ip
        .split('.')
        .slice(0, -1)
        .join('.'),
    )
  ) {
    res.json('Invalid Request: ' + req.ip);
  } else {
    RabbitMessage.update(
      {
        status_id: RabbitMessageStatusType.STATUS.COMPLETE,
      },
      {
        where: { id: req.params.rabbitMessageId },
      },
    )
      .then(result => {
        res.json(result);
      })
      .catch(err => {
        Log.error(err);
        res.json(err);
      });
  }
});
module.exports = Router;
