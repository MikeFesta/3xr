// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Job } from '@models/jobs/job';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (req.user?.id) {
      Job.findAllForUserDashboard(req.user?.id)
        .then(jobs => {
          res.json(jobs);
        })
        .catch((err: Error) => {
          Errors.resJson(res, err, 'Unable to load jobs for user');
        });
    }
  },
);

module.exports = Router;
