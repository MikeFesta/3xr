// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { UserAgreementAttributes, UserAgreementCreationAttributes } from '@types';
import { sql } from '@root/sql';

export interface UserAgreementInstance
  extends Model<UserAgreementAttributes, UserAgreementCreationAttributes>,
  UserAgreementAttributes {}

type UserAgreementModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserAgreementInstance;
};

export const UserAgreement = sql.define(
  'user_agreements',
  {
    id: {
      type: Sequelize.NUMBER,
      primaryKey: true,
      allowNull: false,
    },
    userAgreementTypeId: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    version: {
      type: Sequelize.NUMBER,
      allowNull: false,
    },
    content: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
) as UserAgreementModelStatic;

export default UserAgreement;
