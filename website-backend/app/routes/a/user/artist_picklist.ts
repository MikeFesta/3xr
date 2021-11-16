// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import sequelize from 'sequelize';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    User.scope('artist')
      .findAll({
        attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
        order: [['lastName', 'ASC']],
        where: { lastName: { [sequelize.Op.ne]: '' } },
      })
      .then(users => {
        res.json(users);
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

module.exports = Router;
