// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Job } from '@models/jobs/job';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (req.user?.admin) {
      Job.findAllNeedingTechnicalQa()
        .then(jobs => {
          res.json(jobs);
        })
        .catch((err: Error) => {
          res.json(err);
        });
    } else {
      res.status(403).send('Unauthorized');
    }
  },
);

module.exports = Router;
