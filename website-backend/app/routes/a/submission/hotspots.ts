// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmission } from '@models/asset_submission';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    AssetSubmission.scope('hotspots')
      .findByPk(req.body.id)
      .then(submission => {
        res.json(submission);
      })
      .catch((err: Error) => Errors.resJson(res, err, 'Error getting submission by id'));
  },
);

module.exports = Router;
