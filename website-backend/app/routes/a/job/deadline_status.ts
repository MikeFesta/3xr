// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { RoleEnum } from '@enums';
import { Job } from '@models/jobs/job';
import Errors from '@root/errors';
import UserClient from '@models/user_client';
import UserStudio from '@models/user_studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    let scopes: any[] = ['open', 'groupByStatus'];
    switch (req.user?.primaryRoleId) {
      case (RoleEnum.ARTIST):
        scopes.push({ method: ['forArtist', req.user?.id] });
        break;
      case (RoleEnum.CLIENT):
        // Note: this is currently not visible to clients
        const clientIds = await UserClient.getUserClientIds(req.user?.id);
        scopes.push({ method: ['forClients', clientIds] });
        break;
      case (RoleEnum.QA):
      case (RoleEnum.STUDIO_ADMIN):
        // Note: this is currently not visible to QA
        const studioIds = await UserStudio.getUserStudioIds(req.user?.id);
        scopes.push({ method: ['forStudios', studioIds] });
        break;
      case (RoleEnum.ADMIN):
      default:
        // No additional filters
        break;
    }
    try {
      const results = await Promise.all([
        Job.scope([...scopes, 'deadlineNoRisk']).findAll(),
        Job.scope([...scopes, 'deadlineRisk']).findAll(),
        Job.scope([...scopes, 'deadlineToday']).findAll(),
        Job.scope([...scopes, 'deadlinePastDue']).findAll(),
      ]);
      res.json(results);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load jobs');
    }
  },
);

module.exports = Router;
