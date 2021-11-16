// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmission } from '@models/asset_submission';
import Errors from '@root/errors';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  if (!req.user?.admin) {
    Errors.resAdminOnly(res);
  } else {
    AssetSubmission.findByPk(req.body.id)
      .then(submission => {
        if (submission) {
          const statusId = parseInt(req.body.statusId);
          submission.statusId = statusId;
          submission
            .save()
            .then(save => {
              res.json('success');
            })
            .catch((err: Error) => {
              Errors.resJson(res, err, 'Error saving submission update');
            });
        } else {
          throw new Error(`Cannot find an Asset Submission with an id of ${req.body.id}`);
        }
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Error getting submission by id');
      });
  }
});

module.exports = Router;
