// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Studio } from '@models/studio';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      // TODO: add search filters
      Studio.scope('adminSearch')
        .findAll()
        .then(studios => {
          res.json(studios);
        })
        .catch((err: Error) => {
          res.json(err);
        });
    }
  },
);

module.exports = Router;
