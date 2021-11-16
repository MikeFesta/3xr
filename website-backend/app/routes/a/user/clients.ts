// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const clients = await Client.scope({ method: ['forUser', req.body.id] }).findAll();
      res.json(clients);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load client list');
    }
  },
);

module.exports = Router;
