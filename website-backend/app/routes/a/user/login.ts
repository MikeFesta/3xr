// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Passport from 'passport';
import sequelize from 'sequelize';
import { studioCors } from '@cors/studio';
import { LoginToken } from '@models/login_token';
import { User } from '@models/user';
import IPLog from '@root/models/ip_log';
import Log from '@root/log';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  Passport.authenticate('local', {
    failureRedirect: '/a/user/invalid_login',
  }),
  async (req: express.Request, res: express.Response) => {
    const usernameNormalized = req.body.username.toLowerCase();
    try {
      const user = await User.scope('personalScope').findOne({
        where: {
          username: sequelize.where(sequelize.fn('lower', sequelize.col('username')), '=', usernameNormalized),
        },
      });
      if (user) {
        // Record the login in the ip_logs table
        await IPLog.create({
          ip: req.ip,
          user_id: user.id,
        });
        if (req.body.get_token) {
          return LoginToken.generateTokenForUser(user.id, req)
            .then(token => {
              const user_with_token = user.getUserInfoForStudioLogin();
              user_with_token.token = token;
              res.json(user_with_token);
            })
            .catch((err: Error) => {
              Log.error('Unable to generate login token');
              res.json(user);
            });
        } else {
          res.json(user.getUserInfoForStudioLogin());
        }
      } else {
        throw new Error(`Unable to login. Cannot find a User with with a username of ${usernameNormalized}.`);
      }
    } catch (err) {
      Log.error('Error logging in : ' + err);
      res.json('Unable to load data');
    }
  },
);

module.exports = Router;
