// SPDX-License-Identifier: Apache-2.0
import { BuildOptions, Model, STRING, NUMBER, TEXT } from 'sequelize';
import { sql } from '@root/sql';
import {
  OAuthAuthorizationCodeAttributes,
  OAuthAuthorizationCodeCreationAttributes,
} from '@root/interfaces/OAuthAuthorizationCode';
import User from '../user';
import OAuthClient from './oauth_client';

interface OAuthAuthorizationCodeInstance
  extends Model<OAuthAuthorizationCodeAttributes, OAuthAuthorizationCodeCreationAttributes>,
  OAuthAuthorizationCodeAttributes {}

type OAuthAuthorizationCodeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): OAuthAuthorizationCodeInstance;
};

export const OAuthAuthorizationCode = sql.define(
  'OAuthAuthorizationCode',
  {
    userId: {
      type: NUMBER,
      allowNull: false,
    },
    oauthClientId: {
      type: TEXT,
      allowNull: false,
    },
    authorizationCode: {
      type: STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'oauth_authorization_codes',
    timestamps: true,
  },
) as OAuthAuthorizationCodeModelStatic;

OAuthAuthorizationCode.hasOne(User, {
  as: 'user',
  foreignKey: 'id',
  sourceKey: 'userId',
});

OAuthAuthorizationCode.hasOne(OAuthClient, {
  as: 'oauthClient',
  foreignKey: 'id',
  sourceKey: 'oauthClientId',
});

export default OAuthAuthorizationCode;
