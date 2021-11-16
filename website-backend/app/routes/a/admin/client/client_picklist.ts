// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      Client.scope('picklist').findAll()
        .then((clients: any) => {
          res.json(clients);
        })
        .catch((err: Error) => {
          Errors.resJson(res, err, 'Unable to load clients');
        });
    }
  },
);

module.exports = Router;
