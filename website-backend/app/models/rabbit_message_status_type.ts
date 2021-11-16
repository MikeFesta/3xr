// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { RabbitMessageStatusTypeAttributes, RabbitMessageStatusTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface RabbitMessageStatusTypeInstance
  extends Model<RabbitMessageStatusTypeAttributes, RabbitMessageStatusTypeCreationAttributes>,
  RabbitMessageStatusTypeAttributes {}

type RabbitMessageStatusTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): RabbitMessageStatusTypeInstance;
};

export const RabbitMessageStatusType = sql.define('rabbit_message_status_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as RabbitMessageStatusTypeModelStatic;

export default RabbitMessageStatusType;
