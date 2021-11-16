// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/:username',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    User.scope({ method: ['findByUsernameCaseInsensitive', req.params.username] }).findOne()
      .then(user => {
        res.send(user);
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

module.exports = Router;
