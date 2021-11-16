// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import Log from '@root/log';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    AssetSubmissionIssue.findByPk(req.body.id)
      .then(issue => {
        if (issue) {
          issue.response = req.body.response;
          issue.resolved = req.body.resolved;
          issue
            .save()
            .then(saved_issue => {
              return res.json('success');
            })
            .catch((err: Error) => {
              Log.error('Error Updating Issue');
              Log.error(err);
              res.json('Error Updating Issue');
            });
        } else {
          throw new Error(`Unable to delete the Asset Submission Issue. Cannot find a Asset Submission Issue with an id of ${req.body.id}.`);
        }
      })
      .catch((err: Error) => {
        Log.error('Error Finding Issue');
        Log.error(err);
        res.json('Error Finding Issue');
      });
  },
);

module.exports = Router;
