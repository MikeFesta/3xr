// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { internalOnlyFilter } from '@access/internal_only';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionRender } from '@models/asset_submission_render';
import Log from '@root/log';
const Router = express.Router();

Router.post('/', internalOnlyFilter, (req: express.Request, res: express.Response) => {
  AssetSubmission.findByPk(req.body.submissionId)
    .then(submission => {
      AssetSubmissionRender.recordArray(req.body.submissionId, req.body.renders)
        .then(save => {
          res.json('success');
        })
        .catch((err: Error) => {
          Log.error('Error saving submission renders');
          Log.error(err.message);
          res.status(500).json(err);
        });
    })
    .catch((err: Error) => {
      Log.error('Error getting submission by id');
      Log.error(err.message);
      res.status(500).json(err);
    });
});

module.exports = Router;
