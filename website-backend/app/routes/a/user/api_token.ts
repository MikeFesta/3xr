// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/user/login'),
  (req: express.Request, res: express.Response) => {
    User.findOne({
      attributes: ['apiToken'],
      where: { id: req.user?.id },
    })
      .then(result => {
        res.json(result?.apiToken);
      })
      .catch((err: Error) => {
        res.status(500);
        res.json('');
      });
  },
);

module.exports = Router;
