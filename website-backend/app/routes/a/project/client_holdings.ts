// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { UserClient } from '@models/user_client';
import { ProjectHolding, ProjectHoldingInstance } from '@models/project_holding';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      try {
        const userClientsIds = await UserClient.getUserClientIds(req.user.id);
        const projectHoldings = await ProjectHolding.findByClientIds(userClientsIds);
        return res.json(projectHoldings);
      } catch (err) {
        return Errors.resJson(res, err as Error, 'Error getting projects for user.');
      }
    } else {
      res.status(403).send('Unauthorized');
    }
  },
);

module.exports = Router;
