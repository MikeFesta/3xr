// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Studio } from '@models/studio';
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
      Studio.scope('picklist').findAll()
        .then((studios: any) => {
          res.json(studios);
        })
        .catch((err: Error) => {
          Errors.resJson(res, err, 'Unable to load studios');
        });
    }
  },
);

module.exports = Router;
