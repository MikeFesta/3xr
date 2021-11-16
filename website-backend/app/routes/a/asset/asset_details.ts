// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Asset } from '@models/asset';
import Errors from '@root/errors';
import { studioCors } from '@cors/studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      if (!req.body.uid) {
        throw 'UID missing';
      }
      const asset = await Asset.scope('details').findOne({ where: { uid: req.body.uid } });
      if (!asset) {
        throw 'No asset found for ' + req.body.uid;
      }
      res.json(asset);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Error getting asset by uid');
    }
  },
);

module.exports = Router;
