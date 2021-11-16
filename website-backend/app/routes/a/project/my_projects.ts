// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Project } from '@models/project';
import { studioCors } from '@cors/studio';
import { RoleEnum } from '@enums';
import Errors from '@root/errors';
import UserClient from '@models/user_client';
import UserStudio from '@models/user_studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      let scopes: any[] = ['resultsTable']

      // Return different results based on the user's primary role id
      switch (req.user?.primaryRoleId) {
        case (RoleEnum.ADMIN):
          // Admin = All purchase orders in the system (Note: this is slow because all jobs are returned for Model Count)
          scopes.push('withClient');
          scopes.push('withStudio');
          break;
        case (RoleEnum.CLIENT):
          const clientIds = await UserClient.getUserClientIds(req.user.id);
          scopes.push({ method: ['forClients', clientIds] });
          scopes.push('withStudio');
          break;
        case (RoleEnum.STUDIO_ADMIN):
          const studioIds = await UserStudio.getUserStudioIds(req.user.id);
          scopes.push({ method: ['forStudios', studioIds] });
          scopes.push('withClient');
          break;
        default:
          // ARTIST, QA - Do not have a projects (purchase orders) tab
          throw new Error('Unable to load projects for your primary role');
      }
      const projects = await Project.scope(scopes).findAll();
      res.json(projects);

    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable load projects');
    }

  },
);

module.exports = Router;
