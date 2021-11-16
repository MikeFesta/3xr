// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import Errors from '@root/errors';
import Helpers from '@root/helpers';
import { Studio } from '@models/studio';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      if (!req.user?.admin) {
        Errors.resAdminOnly(res);
      } else {
        if (!req.body.name) {
          res.json('Name cannot be blank');
        } else {
          const uid = await Helpers.getNewUidForModel(Studio, 12);
          await Studio.create({
            name: req.body.name,
            uid: uid,
          });
          res.json('success');
        }
      }
    } catch (err) {
      let errorMessage = 'Unable to Create Studio';
      if ((err as Error).message) {
        errorMessage = (err as Error).message;
      }
      res.json(errorMessage);
    }
  },
);

module.exports = Router;
