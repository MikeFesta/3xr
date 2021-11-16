// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';

import ConnectEnsureLogin from 'connect-ensure-login';
import Errors from '@root/errors';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      try {
        let client = await Client.scope('details').findByPk(req.body.id);
        if (client) {
          client.name = req.body.name;
          await client.save();
          res.json('success');
        } else {
          Errors.resJson(res, null, 'Unable to load client by id');
        }
      } catch (err) {
        Errors.resJson(res, err as Error, 'Unable to edit client');
      }
    }
  },
);

module.exports = Router;
