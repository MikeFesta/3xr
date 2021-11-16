// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Studio } from '@models/studio';
import Errors from '@root/errors';
import { User } from '@models/user';
import UserStudio from '@root/models/user_studio';
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
        const userToLink = await User.findByPk(req.body.userId);
        if (!userToLink?.id) {
          Errors.resJson(res, null, 'User not found');
        } else {
          try {
            await UserStudio.create({
              studioId: studio.id,
              userId: userToLink.id,
            });
            res.json('success');
          } catch (err) {
            Errors.resJson(res, err as Error, 'Error Linking Studio to User');
          }
        }
      }
    }
  },
);

module.exports = Router;
