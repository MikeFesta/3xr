// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Asset } from '@models/asset';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/:uid', studioCors);

Router.get(
  '/:uid',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    Asset.scope('detailsForUnity')
      .findOne({ where: { uid: req.params.uid } })
      .then(asset => {
        res.json(asset);
      })
      .catch((err: Error) => Errors.resJson(res, err, 'Error getting asset by uid'));
  },
);

module.exports = Router;
