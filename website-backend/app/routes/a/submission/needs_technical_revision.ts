// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmissionStatusTypeEnum, JobStatusTypeEnum } from '@enums';
import { AssetSubmission } from '@models/asset_submission';
import { Job } from '@models/jobs/job';
import * as mailer from '@root/mailer';
import Errors from '@root/errors';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  let jobId = 0;
  AssetSubmission.findByPk(req.body.id)
    .then(submission => {
      if (submission) {
        submission.statusId = AssetSubmissionStatusTypeEnum.QA_COMPLETE_FAILED;
        return submission.save();
      } else {
        throw new Error(
          `Unable to do technical revision for Asset Submission. Cannot find an AssetSubmission with an id of ${req.body.id}.`,
        );
      }
    })
    .then(savedSubmission => {
      // Update the job status
      return Job.scope({
        method: ['forAsset', savedSubmission.assetId],
      }).findOne();
    })
    .then(job => {
      if (job) {
        jobId = job.id;
        return job.setStatus(JobStatusTypeEnum.REVISION_NEEDED);
      } else {
        throw new Error(
          `Unable to find Job for Asset Submission. Cannot find an AssetSubmission with an id of ${req.body.id}.`,
        );
      }
    })
    .then(statusLog => {
      return Job.scope('emailArtist').findByPk(jobId);
    })
    .then(job => {
      if (job && job.product && job.product.artist) {
        // Send an email to the artist
        const text =
          'Please review feedback for your model ' +
          job.product.name +
          ' at https://www.3xr.com/product/review/' +
          job.product.uid;
        const html =
          'Please review feedback for your model ' +
          job.product.name +
          ' at <a href="https://www.3xr.com/product/review/' +
          job.product.uid +
          '">https://www.3xr.com/product/review/' +
          job.product.uid;
        return mailer.sendMessageToOrganization(
          job.product.artist.email,
          'QA Feedback Ready - ' + job.product.name,
          text,
          html,
        );
      } else {
        throw new Error(
          `Unable to find job for AssetSubmission. Cannot find an AssetSubmiss with an id of ${req.body.id}.`,
        );
      }
    })
    .then(mailResult => {
      return AssetSubmission.scope('details').findByPk(req.body.id);
    })
    .then(submission => {
      res.json(submission);
    })
    .catch((err: Error) => Errors.resJson(res, err, 'Error updating submission to submit qa comments'));
});

module.exports = Router;
