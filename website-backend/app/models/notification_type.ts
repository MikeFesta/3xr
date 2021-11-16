// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { NotificationTypeAttributes, NotificationTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface NotificationTypeInstance
  extends Model<NotificationTypeAttributes, NotificationTypeCreationAttributes>,
  NotificationTypeAttributes {}

type NotificationTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): NotificationTypeInstance;
};

export const NotificationType = sql.define('notification_types', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as NotificationTypeModelStatic;

export default NotificationType;
