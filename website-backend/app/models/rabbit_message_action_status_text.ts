// SPDX-License-Identifier: Apache-2.0
// DEPRICATED - 99 is always used now, these old statuses should not longer be in use
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { RabbitMessageActionStatusTextAttributes, RabbitMessageActionStatusTextCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface RabbitMessageActionStatusTextInstance
  extends Model<RabbitMessageActionStatusTextAttributes, RabbitMessageActionStatusTextCreationAttributes>,
  RabbitMessageActionStatusTextAttributes {}

type RabbitMessageActionStatusTextModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): RabbitMessageActionStatusTextInstance;
};

export const RabbitMessageActionStatusText = sql.define(
  'rabbit_message_action_status_text',
  {
    action_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    status_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['action_id', 'status_id'],
      },
    ],
  },
) as RabbitMessageActionStatusTextModelStatic;

export default RabbitMessageActionStatusText;
