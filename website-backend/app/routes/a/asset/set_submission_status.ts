// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { internalOnlyFilter } from '@access/internal_only';
import { AssetSubmissionStatusTypeEnum, JobStatusTypeEnum } from '@enums';
import { Job } from '@models/jobs/job';
import { AssetSubmission } from '@models/asset_submission';
import Errors from '@root/errors';
const Router = express.Router();

// TODO: Move this into the submissions folder
// Note, this being called from python on our internal system
// The file ../submission/set_status is an admin call from the website
Router.post('/', internalOnlyFilter, (req: express.Request, res: express.Response) => {
  //res.json('id: ' + req.body.id + ', value = ' + req.body.statusId);
  AssetSubmission.findByPk(req.body.id)
    .then((submission: any) => {
      const statusId = parseInt(req.body.statusId);
      submission.statusId = statusId;
      submission
        .save()
        .then((save: any) => {
          if (req.body.statusId == AssetSubmissionStatusTypeEnum.PROCESSING_COMPLETE) {
            Job.scope({
              method: ['forAsset', submission.assetId],
            })
              .findOne()
              .then((job: any) => {
                job
                  .setStatus(JobStatusTypeEnum.SELF_QA)
                  .then((statusResult: any) => {
                    res.json('success');
                  })
                  .catch((err: Error) => {
                    Errors.resJson(res, err, 'Error saving job status');
                  });
              })
              .catch((err: Error) => {
                Errors.resJson(res, err, 'Error finding job');
              });
          } else {
            res.json('success');
          }
        })
        .catch((err: Error) => {
          Errors.resJson(res, err, 'Error saving submission update');
        });
    })
    .catch((err: Error) => {
      Errors.resJson(res, err, 'Error getting submission by id');
    });
});

module.exports = Router;
