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
        } else {
          // Additional Validation
          if (!User.validateUsername(req.body.username)) {
            res.json('Username may only contain letters and numbers');
          } else if (!User.validateEmail(req.body.email)) {
            res.json('Invalid Email Address');
          } else {
            const user = await User.findByPk(req.body.id);

            if (user) {
              user.email = req.body.email;
              user.username = req.body.username;
              user.firstName = req.body.firstName;
              user.lastName = req.body.lastName;
              if (req.body.primaryRoleId) {
                user.primaryRoleId = req.body.primaryRoleId;
              }
              user.artist = user.primaryRoleId == RoleEnum.ARTIST;
              if (req.body.password) {
                await user.setPassword(req.body.password);
              }
              await user.save();
              res.json('success');
            } else {
              res.json(`cannot find user with id: ${req.body.id}`);
            }
          }
        }
      }
    } catch (err) {
      let errorMessage = 'Unable to Save Changes';
      if ((err as Error).message) {
        errorMessage = (err as Error).message;
      }
      res.json(errorMessage);
    }
  },
);

module.exports = Router;
