// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { UserRoleAttributes } from '@types';
import { sql } from '@root/sql';

interface UserRoleInstance extends Model<UserRoleAttributes, UserRoleAttributes>, UserRoleAttributes {}

type UserRoleModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserRoleInstance;
};

export const UserRole = sql.define('user_role', {
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  role_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as UserRoleModelStatic;

export default UserRole;
