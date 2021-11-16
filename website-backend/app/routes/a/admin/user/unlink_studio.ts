// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Studio } from '@models/studio';
import Errors from '@root/errors';
import { User } from '@models/user';
import UserClient from '@root/models/user_studio';
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
        const userToUnlink = await User.findByPk(req.body.userId);
        if (!userToUnlink?.id) {
          Errors.resJson(res, null, 'User not found');
        } else {
          try {
            const userClient = await UserClient.findOne({
              where: {
                studioId: studio.id,
                userId: userToUnlink.id,
              }
            });
            await userClient?.destroy();
            res.json('success');
          } catch (err) {
            Errors.resJson(res, err as Error, 'Error Unlinking Studio from User');
          }
        }
      }
    }
  },
);

module.exports = Router;
