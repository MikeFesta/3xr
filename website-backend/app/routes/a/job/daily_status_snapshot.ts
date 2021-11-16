// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { JobStatusSnapshot } from '@models/jobs/job_status_snapshot';
import Errors from '@root/errors';
import { internalOnlyFilter } from '@access/internal_only';
import Log from '@root/log';
const Router = express.Router();

Router.get(
  '/',
  internalOnlyFilter,
  (req: express.Request, res: express.Response) => {
    Log.debug('Record daily snapshot');
    JobStatusSnapshot.recordDailySnapshot()
      .then((result: string) => {
        Log.debug('snapshot complete');
        if (result === 'success') {
          res.json('success');
        } else {
          Errors.resJson(res, null, 'Unable to record job status snapshot. Perhaps it was aleady run today');
        }
      })
      .catch((err: Error) => {
        Log.debug('catch error');
        Errors.resJson(res, err, 'Unable to record job status snapshot. Perhaps it was aleady run today');
      })
  },
);

module.exports = Router;
