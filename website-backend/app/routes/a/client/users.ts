// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Errors from '@root/errors';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
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
      if (!req.user?.admin) {
        // Prevent non-admin users from loading unauthorized data
        const clientIds = await UserClient.getUserClientIds(req.user?.id || 0);
        if (!clientIds.includes(req.body.id)) {
          throw new Error('Not authorized to load client data');
        }
      }
      const users = await User.scope(['basic', 'withEmail', { method: ['forClient', req.body.id] }]).findAll();
      res.json(users);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load users for client');
    }
  },
);

module.exports = Router;
