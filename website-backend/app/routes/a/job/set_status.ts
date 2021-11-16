// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Job } from '@models/jobs/job';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resJson(res, null, 'Admin Only');
    } else {
      Job.findOne({ where: { uid: req.body.uid } })
        .then(job => (job ? job.setStatus(req.body.statusId) : Promise.resolve(null)))
        .then(() => res.json('success'))
        .catch((err: Error) => Errors.resJson(res, err, 'Error setting job status'));
    }
  },
);

module.exports = Router;
