// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    Client.scope({ method: ['forUser', req.user?.id] })
      .findOne()
      .then((client: any) => {
        res.json(client);
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Unable to load client details');
      });
  },
);

module.exports = Router;
