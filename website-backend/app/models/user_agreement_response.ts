// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { UserAgreementResponseAttributes, UserAgreementResponseCreationAttributes } from '@types';
import { UserAgreement } from '@models/user_agreement';
import { User } from '@models/user';
import { sql } from '@root/sql';

interface UserAgreementResponseInstance
  extends Model<UserAgreementResponseAttributes, UserAgreementResponseCreationAttributes>,
  UserAgreementResponseAttributes {}

type UserAgreementResponseModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserAgreementResponseInstance;
};

export const UserAgreementResponse = sql.define(
  'user_agreement_responses',
  {
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    userAgreementId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    userId: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    // confirm/deny
    response: {
      allowNull: false,
      type: Sequelize.BOOLEAN,
    },
  },
  {
    timestamps: true,
  },
) as UserAgreementResponseModelStatic;

export default UserAgreementResponse;

UserAgreementResponse.hasOne(User, {
  as: 'user',
  foreignKey: 'id',
  sourceKey: 'userId',
});

UserAgreementResponse.hasOne(UserAgreement, {
  as: 'userAgreementss',
  foreignKey: 'id',
  sourceKey: 'userAgreementId',
});
