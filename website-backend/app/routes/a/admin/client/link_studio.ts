// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';
import ClientStudio from '@root/models/client_studio';
import { Studio } from '@models/studio';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      const studio = await Studio.findByPk(req.body.studioId);
      if (!studio?.id) {
        Errors.resJson(res, null, 'Studio not found');
      } else {
        const client = await Client.findByPk(req.body.clientId);
        if (!client?.id) {
          Errors.resJson(res, null, 'Client not found');
        } else {
          try {
            await ClientStudio.create({
              clientId: client.id,
              studioId: studio.id,
            });
            res.json('success');
          } catch (err) {
            Errors.resJson(res, err as Error, 'Error Linking Studio to Client');
          }
        }
      }
    }
  },
);

module.exports = Router;
