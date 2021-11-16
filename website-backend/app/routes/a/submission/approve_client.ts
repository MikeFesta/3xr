// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmissionStatusTypeEnum, JobStatusTypeEnum, RabbitMessageStatusTypeEnum } from '@enums';
import { Asset } from '@models/asset';
import { AssetSubmission } from '@models/asset_submission';
import { Job } from '@models/jobs/job';
import { RabbitMessage } from '@models/rabbit_message';
import * as mailer from '@root/mailer';
import Errors from '@root/errors';
const RequestPromise = require('request-promise');
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, async (req: express.Request, res: express.Response) => {
  let submission = await AssetSubmission.findByPk(req.body.id);
  if (!submission) {
    Errors.resJson(res, null, 'Submission Not Found');
  } else {
    submission.statusId = AssetSubmissionStatusTypeEnum.QA_COMPLETE_PASSED;
    submission = await submission.save();

    let asset = await Asset.findByPk(submission.assetId);
    if (!asset) {
      Errors.resJson(res, null, 'Asset Not Found');
    } else {
      // Publish the asset (send rabbit message)
      const publishResult = await RequestPromise({
        method: 'POST',
        uri: 'https://x.3xr.com/messages/queue',
        form: {
          data: JSON.stringify({
            assetUid: asset.uid,
            name: asset.name,
            submissionNumber: submission.submissionNumber,
          }),
          queue: 'publish_asset_submission',
          userId: req.user?.id,
        },
      });
      const publish = JSON.parse(publishResult);
      await RabbitMessage.update({ status_id: RabbitMessageStatusTypeEnum.SENT }, { where: { id: publish.rabbit_message_id } });

      let job = await Job.scope(['emailArtist', { method: ['forAsset', submission.assetId], }]).findOne();
      if (job) {
        await job.setStatus(JobStatusTypeEnum.COMPLETE);

        // Crate and Barrel products also need the zip file generated for source materials
        if (job.clientId == 31) {
          const cbzipResult = await RequestPromise({
            method: 'POST',
            uri: 'https://x.3xr.com/messages/queue',
            form: {
              data: JSON.stringify({
                assetUid: asset.uid,
                blendName: asset.name,
                name: job.product?.name.replace(/[^a-zA-Z0-9 -]+/g, ''),
                sku: job.product?.partNumber,
                submissionNumber: submission.submissionNumber,
              }),
              queue: 'export_cb_zip',
              userId: req.user?.id,
            },
          });
          const cbzip = JSON.parse(cbzipResult);
          await RabbitMessage.update({ status_id: RabbitMessageStatusTypeEnum.SENT }, { where: { id: cbzip.rabbit_message_id } });
        }

        // Send an email to the artist letting them know it is complete
        if (job.product && job.product.artist?.email) {
          const text = 'Client QA passed for your model ' +
            job.product.name +
            '. View it at https://3xr.com/product/review/' +
            job.product.uid;
          const html = 'Client QA passed for your model ' +
            job.product.name +
            '. View it at <a href="https://3xr.com/product/review/' +
            job.product.uid +
            '">https://3xr.com/product/review/' +
            job.product.uid;

          await mailer.sendMessageToOrganization(
            job.product.artist.email,
            'Client QA Passed - ' + job.product.name,
            text,
            html,
          );
        }
      }
      res.json(submission);
    }
  }
});

module.exports = Router;
