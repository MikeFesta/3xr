// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { RoleEnum } from '@enums';
import { User } from '@models/user';
import Errors from '@root/errors';
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
        if (!req.body.username) {
          res.json('Username cannot be blank');
        } else if (!req.body.email) {
          res.json('Email cannot be blank');
        } else if (!req.body.password) {
          res.json('Password cannot be blank');
        } else {
          // Additional Validation
          if (!User.validateUsername(req.body.username)) {
            res.json('Username may only contain letters and numbers');
          } else if (!User.validateEmail(req.body.email)) {
            res.json('Invalid Email Address');
          } else {
            const user = await User.create({
              artist: req.body.primaryRoleId == RoleEnum.ARTIST,
              email: req.body.email,
              firstName: req.body.firstName,
              hash: '', // will be set after creation
              lastName: req.body.lastName,
              primaryRoleId: req.body.primaryRoleId,
              username: req.body.username,
            });
            await user.setPassword(req.body.password);
            res.json('success');
          }
        }
      }
    } catch (err) {
      let errorMessage = 'Unable to Create User';
      if ((err as Error).message) {
        errorMessage = (err as Error).message;
      }
      res.json(errorMessage);
    }
  },
);

module.exports = Router;
