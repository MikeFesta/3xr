// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import sequelize from 'sequelize';
import { studioCors } from '@cors/studio';
import { RabbitMessage } from '@models/rabbit_message';
import { RabbitMessageActionStatusText } from '@models/rabbit_message_action_status_text';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/:id',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/user/login'),
  (req: express.Request, res: express.Response) => {
    RabbitMessage.findByPk(req.params.id, {
      attributes: ['status_id', 'updatedAt', 'error_message'],
      include: [
        {
          as: 'status_text',
          attributes: ['text'],
          model: RabbitMessageActionStatusText,
          where: sequelize.where(sequelize.col('status_text.status_id'), sequelize.col('rabbit_message.status_id')),
        },
      ],
    })
      .then(result => {
        res.json(result);
      })
      .catch((err: Error) => {
        res.json({ error: err });
      });
  },
);

module.exports = Router;
