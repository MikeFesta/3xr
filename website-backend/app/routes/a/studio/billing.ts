// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Job } from '@models/jobs/job';
import Errors from '@root/errors';
import UserStudio from '@root/models/user_studio';
import { ScopeOptions } from 'sequelize';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      if (!req.body.currentMonth) {
        throw 'Current Month Missing';
      }
      if (!req.body.lastMonth) {
        throw 'Last Month Missing';
      }
      const scopes: [string | ScopeOptions] = ['billing'];
      if (!req.user?.admin) {
        // Admins see all jobs, non-admins only see their studios
        const userStudios = await UserStudio.getUserStudioIds(req.user?.id || 0);
        scopes.push({ method: ['forStudios', userStudios] });
      }
      const currentMonthJobsComplete = await Job.scope([
        ...scopes,
        { method: ['billingMonth', req.body.currentMonth] },
      ]).findAll();
      const lastMonthJobsComplete = await Job.scope([
        ...scopes,
        { method: ['billingMonth', req.body.lastMonth] },
      ]).findAll();
      const pendingJobs = await Job.scope([...scopes, { method: ['billingMonth', 0] }]).findAll();
      res.json({
        currentMonthJobsComplete,
        lastMonthJobsComplete,
        pendingJobs,
      });
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load billing information: ' + (err as Error).message);
    }
  },
);

module.exports = Router;
