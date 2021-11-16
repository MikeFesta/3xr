// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmissionStatusTypeEnum } from '@enums';
import { AssetSubmission } from '@models/asset_submission';
import { Job } from '@models/jobs/job';
import Errors from '@root/errors';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  if (!req.user?.admin) {
    Errors.resAdminOnly(res);
  } else {
    AssetSubmission.findByPk(req.body.id)
      .then((submission: any) => {
        submission.statusId = AssetSubmissionStatusTypeEnum.QA_IN_PROGRESS;
        return submission.save();
      })
      .then((submission: any) => {
        return Job.scope({ method: ['forAsset', submission.assetId] }).findOne();
      })
      .then((job: any) => {
        // Note that the first submission saved does not have the full scope
        // Loading scope details at the top does not update the status object
        return AssetSubmission.scope('details').findByPk(req.body.id);
      })
      .then((submission: any) => {
        res.json(submission);
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Error saving submission update');
      });
  }
});

module.exports = Router;
