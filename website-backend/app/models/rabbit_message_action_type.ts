// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { RabbitMessageActionTypeAttributes, RabbitMessageActionTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface RabbitMessageActionTypeInstance
  extends Model<RabbitMessageActionTypeAttributes, RabbitMessageActionTypeCreationAttributes>,
  RabbitMessageActionTypeAttributes {}

type RabbitMessageActionTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): RabbitMessageActionTypeInstance;
};

export const RabbitMessageActionType = sql.define('rabbit_message_action_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as RabbitMessageActionTypeModelStatic;

export default RabbitMessageActionType;
