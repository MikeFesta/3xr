// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { ClientClass } from '@models/client_class';
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
      const classes = await ClientClass.scope('picklist').findAll(
        { where: { clientId: req.body.clientId } }
      );
      res.json(classes);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load classes');
    }
  },
);

module.exports = Router;
