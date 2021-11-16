// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { assignProducts } from '@services/Product';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/user/login'),
  async (req: express.Request, res: express.Response) => {
    const { uids, artistId } = req.body;
    try {
      await assignProducts(uids, artistId);
      res.json(uids);
    } catch (err) {
      Errors.resJson(res, err as Error, (err as Error).message || 'Error assigning artists to a purchase order');
    }
  },
);

module.exports = Router;
