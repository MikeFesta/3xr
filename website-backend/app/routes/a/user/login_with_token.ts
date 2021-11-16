// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { LoginToken, LoginTokenInstance } from '@models/login_token';
import { User } from '@models/user';
const Passport = require('passport');
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  Passport.authenticate('authtoken', {
    failureRedirect: '/a/user/invalid_login',
  }),
  (req: express.Request, res: express.Response) => {
    User.scope('personalScope')
      .findOne({
        include: [
          {
            as: 'loginTokens',
            model: LoginToken,
            where: { token: req.body.token },
          },
        ],
      })
      .then(user => {
        // Update the login token to keep active so old tokens can be deleted / expired
        const userAgent = req.headers['user-agent'];
        if (user && user.loginTokens && user.loginTokens[0] && userAgent) {
          const firstUserToken = user.loginTokens[0]
          firstUserToken.ip = req.ip;
          firstUserToken.userAgent = userAgent;
          firstUserToken.changed('updatedAt', true);
          firstUserToken
            .save()
            .then(result => {
              res.json(user.getUserInfoForStudioLogin());
            })
            .catch((err: Error) => {
              res.json('Unable to update token');
            })
        } else {
          throw new Error('Unable to update login token')
        }
      })
      .catch((err: Error) => {
        res.json('Unable to load data');
      });
  },
);

module.exports = Router;
