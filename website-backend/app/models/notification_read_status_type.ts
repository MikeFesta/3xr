// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { NotificationReadStatusTypeAttributes, NotificationReadStatusTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface NotificationReadStatusTypeInstance
  extends Model<NotificationReadStatusTypeAttributes, NotificationReadStatusTypeCreationAttributes>,
  NotificationReadStatusTypeAttributes {}

type NotificationReadStatusTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): NotificationReadStatusTypeInstance;
};

export const NotificationReadStatusType = sql.define('project_status_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as NotificationReadStatusTypeModelStatic;

export default NotificationReadStatusType;
