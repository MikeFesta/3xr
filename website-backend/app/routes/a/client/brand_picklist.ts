// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { ClientBrand } from '@models/client_brand';
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
      const brands = await ClientBrand.scope('picklist').findAll(
        { where: { clientId: req.body.clientId } }
      );
      res.json(brands);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load brands');
    }
  },
);

module.exports = Router;
