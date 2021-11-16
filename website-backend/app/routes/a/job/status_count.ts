// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { RoleEnum } from '@enums';
import { Job } from '@models/jobs/job';
import Errors from '@root/errors';
import UserStudio from '@models/user_studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    const scopes: Array<any> = ['statusCount'];
    switch (req.user?.primaryRoleId) {
      case RoleEnum.ARTIST:
        scopes.push({ method: ['forArtist', req.user.id] });
        break;
      case RoleEnum.CLIENT:
        // Users can have more than one client
        scopes.push({ method: ['forClientByUserRaw', req.user.id] });
        break;
      case RoleEnum.STUDIO_ADMIN:
        const studioIds = await UserStudio.getUserStudioIds(req.user.id);
        scopes.push({ method: ['forStudios', studioIds] });
        break;
    }
    Job.scope(scopes)
      .findAll({})
      .then((results: any) => {
        res.json(results);
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Unable to load job status counts');
      });
  },
);

module.exports = Router;
