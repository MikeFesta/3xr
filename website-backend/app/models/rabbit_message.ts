// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import RequestPromise from 'request-promise';
import { RabbitMessageCreationAttributes, RabbitMessageAttributes } from '@types';
import { RabbitMessageStatusTypeEnum } from '@enums';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { sql } from '@root/sql';

interface RabbitMessageInstance
  extends Model<RabbitMessageAttributes, RabbitMessageCreationAttributes>,
  RabbitMessageAttributes {}

type RabbitMessageModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): RabbitMessageInstance;
  createForQueue(queue: any, userId: number, data: any): Promise<RabbitMessageInstance>;
  sendNewMessageToQueueWithData(queue: string, data: any, userId: number): Promise<number>;
};

export const RabbitMessage = sql.define(
  'rabbit_message',
  {
    action_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    },
    queue: {
      type: Sequelize.STRING,
      unique: false,
    },
    status_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    },
    data: {
      type: Sequelize.TEXT,
      allowNull: false,
      unique: false,
    },
    error_message: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false,
    },
    delete: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any) {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('h:mm:ssa MM/DD/YYYY');
      },
      updatedAt: function (this: any) {
        const utc_date = moment.utc(this.getDataValue('updatedAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('h:mm:ssa MM/DD/YYYY');
      },
    },
  },
) as RabbitMessageModelStatic;

export default RabbitMessage;

import { RabbitMessageActionType } from '@models/rabbit_message_action_type';
import { RabbitMessageActionTypeEnum } from '@enums';
import { RabbitMessageActionStatusText } from '@models/rabbit_message_action_status_text';
import { RabbitMessageStatusType } from '@models/rabbit_message_status_type';
import { User } from '@models/user';

RabbitMessage.createForQueue = (queue, userId, data) => {
  return RabbitMessage.create({
    action_id: RabbitMessageActionTypeEnum.USING_QUEUE_NAME,
    queue: queue,
    status_id: RabbitMessageStatusTypeEnum.NEW,
    user_id: userId,
    data: data,
  });
};

RabbitMessage.sendNewMessageToQueueWithData = async (queue: string, data: any, userId: number) => {
  let rabbitMessageId = 0;
  try {
    const xServerResult = await RequestPromise({
      method: 'POST',
      uri: 'https://x.3xr.com/messages/queue',
      form: {
        data: JSON.stringify(data),
        queue,
        userId,
      },
    });
    rabbitMessageId = JSON.parse(xServerResult).rabbit_message_id;
    if (rabbitMessageId) {
      const rabbitMessage = await RabbitMessage.findByPk(rabbitMessageId);
      if (rabbitMessage) {
        rabbitMessage.status_id = RabbitMessageStatusTypeEnum.SENT;
        await rabbitMessage.save();
      }
    }
    return rabbitMessageId;
  } catch {
    return 0;
  }
};

RabbitMessage.hasOne(RabbitMessageActionType, {
  as: 'action',
  foreignKey: 'id',
  sourceKey: 'action_id',
});

RabbitMessage.hasOne(RabbitMessageActionStatusText, {
  as: 'status_text',
  foreignKey: 'action_id',
  sourceKey: 'action_id',
});

RabbitMessage.hasOne(RabbitMessageStatusType, {
  as: 'status',
  foreignKey: 'id',
  sourceKey: 'status_id',
});

RabbitMessage.hasOne(User, {
  as: 'user',
  foreignKey: 'id',
  sourceKey: 'user_id',
});
