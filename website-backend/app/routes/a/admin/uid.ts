// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import helpers from '@root/helpers';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (req.user?.admin) {
      res.json(helpers.getRandomString(12));
    } else {
      res.status(403).send('Unauthorized');
    }
  },
);

module.exports = Router;
