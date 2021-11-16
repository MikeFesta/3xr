import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/:assetSubmissionId',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    AssetSubmissionIssue.scope(['basic', 'resolved'])
      .findAll({
        where: { assetSubmissionId: req.params.assetSubmissionId },
      })
      .then(issues => {
        return res.json(issues);
      })
      .catch((err: Error) => Errors.resJson(res, err, 'Error Finding Issues for Submission'));
  },
);

module.exports = Router;
