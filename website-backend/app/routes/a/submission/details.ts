// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { AssetSubmission } from '@models/asset_submission';
import Errors from '@root/errors';
import { studioCors } from '@cors/studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    AssetSubmission.scope('details')
      .findByPk(req.body.id)
      .then(submission => {
        //@ts-ignore
        if (submission && submission.userId != req.user.id && !req.user.admin) {
          Errors.resJson(res, null, 'Unauthorized');
        } else {
          res.json(submission);
        }
      })
      .catch((err: Error) => Errors.resJson(res, err, 'Error getting submission by id'));
  },
);

module.exports = Router;
