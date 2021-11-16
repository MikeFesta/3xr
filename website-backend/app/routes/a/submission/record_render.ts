// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { internalOnlyFilter } from '@access/internal_only';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionRender } from '@models/asset_submission_render';
import Errors from '@root/errors';
const Router = express.Router();

Router.post('/', internalOnlyFilter, (req: express.Request, res: express.Response) => {
  AssetSubmission.findByPk(req.body.submissionId)
    .then((submission: any) => {
      AssetSubmissionRender.create({
        assetSubmissionId: req.body.submissionId,
        filename: req.body.render
      })
        .then((created: any) => {
          res.json('success');
        })
        .catch((err: Error) => {
          Errors.resJson(res, err, 'Error saving submission renders');
        });
    })
    .catch((err: Error) => {
      Errors.resJson(res, err, 'Error getting submission by id ' + req.body.submissionId);
    });
});

module.exports = Router;
