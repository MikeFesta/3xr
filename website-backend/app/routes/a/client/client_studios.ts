// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import Errors from '@root/errors';
import { Studio } from '@models/studio';
import UserClient from '@models/user_client';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const clients: any[] = await UserClient.getUserClientIds(req.user?.id || 0);
      if (!clients.includes(req.body.id)) {
        Errors.resJson(res, null, 'You are not associated with the selected client');
      } else {
        const studios = await Studio.scope({ method: ['forClient', req.body.id] }).findAll();
        res.json(studios);
      }
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load studios for cilent');
    }
  },
);

module.exports = Router;
