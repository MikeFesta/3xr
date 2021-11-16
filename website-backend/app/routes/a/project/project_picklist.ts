// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Errors from '@root/errors';
import { Project } from '@models/project';
import { RoleEnum } from '@enums';
import { studioCors } from '@cors/studio';
import { UserClient } from '@models/user_client';
import UserStudio from '@models/user_studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    const scopes: Array<any> = ['picklist'];

    try {
      switch (req.user?.primaryRoleId) {
        case (RoleEnum.CLIENT):
          const clientIds = await UserClient.getUserClientIds(req.user?.id || 0);
          scopes.push({ method: ['forClients', clientIds] })
          break;
        case (RoleEnum.STUDIO_ADMIN):
        case (RoleEnum.ARTIST):
        case (RoleEnum.QA):
          const studioIds = await UserStudio.getUserStudioIds(req.user?.id || 0);
          scopes.push({ method: ['forStudios', studioIds] })
          break;
        case (RoleEnum.ADMIN):
          break;
      }
      const projects = await Project.scope(scopes).findAll();
      res.json(projects);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Error loading projects');
    }
  },
);

module.exports = Router;
