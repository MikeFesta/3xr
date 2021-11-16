// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
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
      const artists = await User.scope(['artist', 'picklist', { method: ['forStudio', req.body.id] }]).findAll();
      res.json(artists);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load artists');
    }
  },
);

module.exports = Router;
