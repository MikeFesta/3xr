// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Errors from '@root/errors';
import { Job } from '@models/jobs/job';
import { studioCors } from '@cors/studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const job = await Job.scope('details').findOne({ where: { uid: req.body.uid } });
      res.json(job);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load job details');
    }
  },
);

module.exports = Router;
