// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Job } from '@models/jobs/job';
import { Project } from '@models/project';
import Errors from '@root/errors';
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
      // some frontend pages pass the id, others pass the uid
      let projectId = req.body.id;
      if (!projectId && req.body.uid) {
        const project = await Project.findOne({ where: { uid: req.body.uid } });
        if (project) {
          projectId = project.id;
        }
      }

      const jobs = await Job.scope('projectDashboard').findAll({ where: { projectId } });
      res.json(jobs);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load jobs');
    }
  },
);

module.exports = Router;
