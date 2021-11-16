// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import Bcrypt from 'bcryptjs';
import { LoginTokenAttributes, LoginTokenCreationAttributes } from '@types';
import { User } from '@models/user';
import Helpers from '@root/helpers';
import { sql } from '@root/sql';

import Log from '@root/log';

export interface LoginTokenInstance
  extends Model<LoginTokenAttributes, LoginTokenCreationAttributes>,
  LoginTokenAttributes {}

type LoginTokenModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): LoginTokenInstance;
  generateTokenForUser(userId: number, req: express.Request): Promise<string>;
};

export const LoginToken = sql.define('login_token', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  ip: {
    type: Sequelize.STRING,
    unique: false,
  },
  userAgent: {
    type: Sequelize.STRING,
    unique: false,
  },
}) as LoginTokenModelStatic;

export default LoginToken;

LoginToken.generateTokenForUser = function (userId: number, req: express.Request): Promise<string> {
  return new Promise((resolve, reject) => {
    Bcrypt.hash(Helpers.getRandomString(12), 10, (err, hash) => {
      if (err) {
        Log.error('unable to create hash');
        reject(err);
      }
      LoginToken.create({
        userId: userId,
        token: hash,
        ip: req.ip,
        userAgent: req.headers['user-agent'] || '',
      })
        .then(result => {
          resolve(hash);
        })
        .catch((err: Error) => {
          Log.error('unable to insert login token to db');
          Log.error(err);
          reject(err);
        });
    });
  });
};

LoginToken.hasOne(User, {
  as: 'user',
  foreignKey: 'id',
  sourceKey: 'userId',
});
