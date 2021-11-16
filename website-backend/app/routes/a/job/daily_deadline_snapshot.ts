// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { JobDeadlineSnapshot } from '@models/jobs/job_deadline_snapshot';
import Errors from '@root/errors';
import { internalOnlyFilter } from '@access/internal_only';
const Router = express.Router();

Router.get(
  '/',
  internalOnlyFilter,
  (req: express.Request, res: express.Response) => {
    JobDeadlineSnapshot.recordDailySnapshot()
      .then((result: string) => {
        if (result === 'success') {
          res.json('success');
        } else {
          Errors.resJson(res, null, 'Unable to record job deadline snapshot. Perhaps it was aleady run today');
        }
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Unable to record job deadline snapshot. Perhaps it was aleady run today');
      })
  },
);

module.exports = Router;
