// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { RoleAttributes, RoleCreationAttributes } from '@types';
import { User } from '@models/user';
import { sql } from '@root/sql';

interface RoleInstance extends Model<RoleAttributes, RoleCreationAttributes>, RoleAttributes {}

type RoleModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): RoleInstance;
};

export const Role = sql.define('role', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
}) as RoleModelStatic;

export default Role;

// Additional dependancies that would be cyclic
import { UserRole } from '@models/user_role';

// Joins
Role.belongsToMany(User, { as: 'users', through: UserRole });
