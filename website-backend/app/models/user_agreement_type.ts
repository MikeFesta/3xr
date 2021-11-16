// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { UserAgreementTypeAttributes, UserAgreementTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface UserAgreementTypeInstance
  extends Model<UserAgreementTypeAttributes, UserAgreementTypeCreationAttributes>,
  UserAgreementTypeAttributes {}

type UserAgreementTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserAgreementTypeInstance;
};

export const UserAgreementType = sql.define(
  'user_agreement_types',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  },
) as UserAgreementTypeModelStatic;

export default UserAgreementType;
