// SPDX-License-Identifier: Apache-2.0
import { BuildOptions, Model, TEXT } from 'sequelize';
import { sql } from '@root/sql';
import { OAuthClientAttributes, OAuthClientCreationAttributes } from '@root/interfaces/OAuthClient';

export interface OAuthClientInstance
  extends Model<OAuthClientAttributes, OAuthClientCreationAttributes>,
  OAuthClientAttributes {}

type OAuthClientModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): OAuthClientInstance;
};

export const OAuthClient = sql.define(
  'OAuthClient',
  {
    clientId: {
      type: TEXT,
      allowNull: false,
    },
    clientSecret: {
      type: TEXT,
      allowNull: false,
    },
  },
  {
    tableName: 'oauth_clients',
  },
) as OAuthClientModelStatic;

export default OAuthClient;
