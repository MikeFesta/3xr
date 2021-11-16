// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmissionStatusTypeEnum } from '@enums';
import { AssetSubmission } from '@models/asset_submission';
import Log from '@root/log';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  AssetSubmission.findByPk(req.body.id)
    .then(submission => {
      if (submission) {
        submission.statusId = AssetSubmissionStatusTypeEnum.SUBMISSION_CANCELED;
        submission
          .save()
          .then(save => {
            res.json('success');
          })
          .catch((err: Error) => {
            Log.error('Error saving submission update');
            Log.error(err.message);
            res.json(err);
          });
      } else {
        throw new Error(`Unable to cancel submission. Cannot find a AssetSubmission with an id of ${req.body.id}.`);
      }
    })
    .catch((err: Error) => {
      Log.error('Error getting submission by id');
      Log.error(err.message);
      res.json(err);
    });
});

module.exports = Router;
