// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      AssetSubmissionIssue.findByPk(req.body.id)
        .then(issue => {
          if (issue) {
            issue.deleted = true;
            return issue.save();
          } else {
            throw new Error(`Unable to delete the Issue. Cannot find a Issue with an id of ${req.params.uid}.`);
          }
        })
        .then(saved_issue => {
          return AssetSubmission.scope('details').findByPk(saved_issue.assetSubmissionId);
        })
        .then(submission => {
          res.json(submission);
        })
        .catch((err: Error) => {
          Errors.resJson(res, err, 'Error deleting issue');
        });
    }
  },
);

module.exports = Router;
