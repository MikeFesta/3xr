// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Studio } from '@models/studio';
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
      const studios = await Studio.scope({ method: ['forUser', req.body.id] }).findAll();
      res.json(studios);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load studio list');
    }
  },
);

module.exports = Router;
