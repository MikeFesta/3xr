// SPDX-License-Identifier: Apache-2.0
import { Strategy as AuthTokenStrategy } from 'passport-auth-token';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as BearerStrategy } from 'passport-http-bearer';

import Bcrypt from 'bcryptjs';
import Sequelize = require('sequelize');

import User from '@root/models/user';
import LoginToken from '@root/models/login_token';
import { decodeToken } from '@root/services/OAuth';
import Log from '@root/log';

export const authTokenStrategy = new AuthTokenStrategy((token: string, next: Function) => {
  return User.scope('fullScope')
    .findOne({
      include: [
        {
          as: 'loginTokens',
          model: LoginToken,
          where: { token: token },
        },
      ],
    })
    .then((user: any) => {
      if (!user) {
        Log.error('AuthToken strategy failed for token: ' + token);
        next(null, false);
      } else {
        Log.debug(user.username + ' logged in with a token');
        next(null, user);
        return null;
      }
    })
    .catch((err: Error) => {
      Log.error('Error loading user on login');
      next(Error('Error Loading User Data'));
    });
});

export const localStrategy = new LocalStrategy((username: string, password: string, next: Function) => {
  // TODO: Refactor to move this into User class
  User.scope('fullScope')
    .findOne({
      where: {
        username: Sequelize.where(Sequelize.fn('lower', Sequelize.col('username')), '=', username.toLowerCase()),
      },
    })
    .then((userFull: any) => {
      if (!userFull) {
        Log.error('Unable to load data with local strategy for user: ' + username);
        next(null, false);
      } else {
        Bcrypt.compare(password, userFull.hash)
          .then((result: any) => {
            if (!result) {
              next(null, false);
            } else {
              // Password matches get clean user info
              User.findOne({
                where: {
                  id: userFull.id,
                },
              })
                .then((user: any) => {
                  Log.debug(username + ' logged in with a password');
                  next(null, user);
                  return null;
                })
                .catch((err: Error) => {
                  Log.error('Error loading user on login');
                  next(Error('Error Loading User Data'));
                });
            }
          })
          .catch((err: Error) => {
            next(null, false);
          });
      }
    })
    .catch((err: Error) => {
      Log.error('Problem logging in for user ' + username);
      next(err);
    });
});

export const bearerStrategy = new BearerStrategy(async (accessToken: string, callback: Function) => {
  try {
    const decoded = decodeToken(accessToken);
    const user = await User.findOne({ where: { username: decoded.user.username } });

    if (!user || !decoded) {
      return callback(null, false);
    }

    return callback(null, user, { scope: 'all' });
  } catch (err) {
    return callback(err);
  }
});
