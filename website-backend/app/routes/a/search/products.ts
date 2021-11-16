// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Product } from '@models/product';
import { ScopeOptions } from 'sequelize';
import Errors from '@root/errors';
import { RoleEnum } from '@enums';
import UserStudio from '@models/user_studio';
import UserClient from '@models/user_client';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const scopes: (string | ScopeOptions)[] = [
        { method: ['card', req.user?.id] },
        { method: ['search', req.body.query] },
      ];

      if (!req.user?.admin) {
        switch (req.user?.primaryRoleId) {
          case RoleEnum.ARTIST:
            scopes.push({ method: ['forArtist', req.user?.id] });
            break;
          case RoleEnum.CLIENT:
            const userClients = await UserClient.getUserClientIds(req.user?.id || 0);
            scopes.push({ method: ['forClients', userClients] });
            break;
          default:
            const userStudios = await UserStudio.getUserStudioIds(req.user?.id || 0);
            scopes.push({ method: ['forStudios', userStudios] });
            break;
        }
      }

      const productSearchResults = await Product.scope(scopes).findAll();
      res.json(productSearchResults);
    } catch (err) {
      Errors.resJson(res, err as Error, 'Error getting search results');
    }
  },
);

module.exports = Router;
