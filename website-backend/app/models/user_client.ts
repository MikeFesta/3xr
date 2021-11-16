// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { UserClientAttributes } from '3xr_types';
import { sql } from '@root/sql';

interface UserClientInstance extends Model<UserClientAttributes, UserClientAttributes>, UserClientAttributes {}

type UserClientModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserClientInstance;
  getUserClientIds(userId: number): Promise<number[]>;
};

export const UserClient = sql.define('user_client', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  clientId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as UserClientModelStatic;

export default UserClient;

UserClient.getUserClientIds = async (userId: number) => {
  const userClients = await UserClient.findAll({
    where: { userId: userId },
  });
  return userClients.map(userClient => userClient.clientId);
};
