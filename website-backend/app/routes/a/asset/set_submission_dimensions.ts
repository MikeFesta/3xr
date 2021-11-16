// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { AssetSubmission } from '@models/asset_submission';
import { internalOnlyFilter } from '@access/internal_only';
import Log from '@root/log';
const Router = express.Router();

Router.post('/', internalOnlyFilter, (req: express.Request, res: express.Response) => {
  AssetSubmission.findByPk(req.body.id)
    .then(submission => {
      if (submission) {
        const statusId = parseInt(req.body.statusId);
        submission.unitTypeId = parseInt(req.body.unitTypeId);
        submission.height = parseFloat(req.body.height);
        submission.width = parseFloat(req.body.width);
        submission.depth = parseFloat(req.body.depth);
        submission.triangleCount = req.body.triangleCount ? parseInt(req.body.triangleCount) : 0;
        submission.lightCount = req.body.lightCount ? parseInt(req.body.lightCount) : 0;
        submission
          .save()
          .then(save => {
            res.json('success');
          })
          .catch((err: Error) => {
            Log.error('Error saving submission dimensions');
            Log.error(err);
            res.status(500).json(err);
          });
      }
    })
    .catch((err: Error) => {
      Log.error('Error getting submission by id');
      Log.error(err);
      res.status(500).json(err);
    });
});

module.exports = Router;
