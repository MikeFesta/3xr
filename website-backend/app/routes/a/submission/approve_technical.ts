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
  if (!req.user?.admin) {
    Errors.resAdminOnly(res);
  } else {
    let jobId = 0;
    AssetSubmission.findByPk(req.body.id)
      .then((submission: any) => {
        submission.statusId = AssetSubmissionStatusTypeEnum.QA_IN_PROGRESS;
        submission.hasReachedClient = true;
        return submission.save();
      })
      .then((savedSubmission: any) => {
        // Update the job status
        return Job.scope({
          method: ['forAsset', savedSubmission.assetId],
        }).findOne();
      })
      .then((job: any) => {
        jobId = job.id;
        return job.setStatus(JobStatusTypeEnum.CLIENT_QA);
      })
      .then((statusLog: any) => {
        return Job.scope('emailArtist').findByPk(jobId);
      })
      .then((job: any) => {
        // Send an email to the artist letting them know it is complete
        const text =
          'Techincal QA passed for your model ' +
          job.product.name +
          '. View it at https://www.3xr.com/product/review/' +
          job.product.uid;
        const html =
          'Techincal QA passed for your model ' +
          job.product.name +
          '. View it at <a href="https://www.3xr.com/product/review/' +
          job.product.uid +
          '">https://www.3xr.com/product/review/' +
          job.product.uid;
        return mailer.sendMessageToOrganization(
          job.product.artist.email,
          'Technical QA Passed - ' + job.product.name,
          text,
          html,
        );
      })
      .then((mailResult: any) => {
        return AssetSubmission.scope('details').findByPk(req.body.id);
      })
      .then((submission: any) => {
        res.json(submission);
      })
      .catch((err: Error) => Errors.resJson(res, err, 'Error approving submission id: ' + req.body.id));
  }
});

module.exports = Router;
