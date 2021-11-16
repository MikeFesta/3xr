// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import Errors from '@root/errors';
import { Job } from '@models/jobs/job';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const jobs = await Job.scope({ method: ['preview', req.body.uid] }).findAll();
      if (jobs.length > 0) {
        res.json(jobs[0]);
      } else {
        Errors.resJson(res, null, 'Unable to load job preview');
      }
    } catch (err) {
      Errors.resJson(res, err as Error, 'Error loading job preview');
    }
  },
);

module.exports = Router;
