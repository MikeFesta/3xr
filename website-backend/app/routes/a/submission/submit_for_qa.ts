// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { JobStatusTypeEnum, AssetSubmissionStatusTypeEnum } from '@enums';
import { AssetSubmission } from '@models/asset_submission';
import { Job } from '@models/jobs/job';
import Errors from '@root/errors';
import Log from '@root/log';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, async (req: express.Request, res: express.Response) => {
  try {
    const submission = await AssetSubmission.findByPk(req.body.id);
    if (!submission) {
      throw new Error(`could not find submission by id: ${req.body.id}`);
    }

    //if (!req.user?.admin && submission.userId != req.user?.id) {
    //  Errors.resJson(res, null, 'Not Authorized. ' + submission?.userId || '00' + ' != ' + req.user?.id || '00');
    //} else {
    Log.debug('User submitting for QA ' + (submission?.userId || '00') + ' =? ' + (req.user?.id || '00'));
    //submission.statusId = AssetSubmissionStatusTypeEnum.READY_FOR_QA;
    submission.statusId = AssetSubmissionStatusTypeEnum.QA_IN_PROGRESS;
    // 8/11/21 - Sending directly to client (copied from approve_technical.ts)
    submission.hasReachedClient = true;
    return submission
      .save()
      .then(save => {
        return Job.scope({
          method: ['forAsset', submission.assetId],
        }).findOne();
      })
      .then(job => {
        // 8/11/21 - Skipping 3XR QA for now
        //return job?.setStatus(JobStatusTypeEnum.TECHNICAL_QA);
        return job?.setStatus(JobStatusTypeEnum.CLIENT_QA);
      })
      .then(statusUpdated => {
        res.json('success');
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Error submitting for QA');
      });
    //}
  } catch (err) {
    Errors.resJson(res, err as Error, 'Error submitting for QA');
  }
});

module.exports = Router;
