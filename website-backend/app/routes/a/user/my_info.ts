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
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (!req.user) {
      res.status(403).send('unauthorized');
      //res.json('unauthorized');
    } else {
      User.findByPk(req.user?.id)
        .then(user => {
          res.json(user);
        })
        .catch((err: Error) => {
          res.json(err);
        });
    }
  },
);

module.exports = Router;
