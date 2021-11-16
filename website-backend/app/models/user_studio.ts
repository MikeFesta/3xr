// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { UserStudioAttributes } from '3xr_types';
import { sql } from '@root/sql';

interface UserStudioInstance extends Model<UserStudioAttributes, UserStudioAttributes>, UserStudioAttributes {}

type UserStudioModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserStudioInstance;
  getUserStudioIds(userId: number): Promise<number[]>;
};

export const UserStudio = sql.define('user_studio', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  studioId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as UserStudioModelStatic;

export default UserStudio;

UserStudio.getUserStudioIds = async (userId: number) => {
  const userStudios = await UserStudio.findAll({
    where: { userId: userId },
  });
  return userStudios.map(userStudio => userStudio.studioId);
};
