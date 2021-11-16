// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { LoginToken } from '@models/login_token';
import { User } from '@models/user';
import Log from '@root/log';
const Passport = require('passport');
const RequestPromise = require('request-promise');
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  (req: express.Request, res: express.Response, next) => {
    RequestPromise({
      method: 'POST',
      uri: 'https://www.google.com/recaptcha/api/siteverify',
      form: {
        secret: 'REDACTED',
        response: req.body.recaptchaToken,
        remoteip: req.ip,
      },
    })
      .then(googleResult => {
        const obj = JSON.parse(googleResult);
        if (!obj.success) {
          res.json('Robot check failed');
        } else {
          next();
        }
      })
      .catch((err: Error) => {
        res.json('Error with bot check failed');
      });
  },
  Passport.authenticate('local', {
    failureRedirect: '/a/user/invalid_login',
  }),
  (req: express.Request, res: express.Response) => {
    User.scope('personalScope')
      .findOne({
        where: { username: req.body.username },
      })
      .then(user => {
        if (user) {
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
          throw new Error(`Unable to login with password. Cannot find a User with a username of "${req.body.username}".`);
        }
      })
      .catch((err: Error) => {
        Log.error('Error logging in : ' + err);
        res.json('Unable to load data');
      });
  },
);

module.exports = Router;
