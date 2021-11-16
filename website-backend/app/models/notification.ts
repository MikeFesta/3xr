// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { NotificationAttributes, NotificationCreationAttributes } from '@types';
import { NotificationReadStatusTypeEnum } from '@enums';
import { sql } from '@root/sql';

interface NotificationInstance
  extends Model<NotificationAttributes, NotificationCreationAttributes>,
  NotificationAttributes {}

type NotificationModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): NotificationInstance;
};

export const Notification = sql.define(
  'notification',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    readStatusId: {
      type: Sequelize.INTEGER,
      defaultValue: NotificationReadStatusTypeEnum.PENDING,
      allowNull: false,
    },
    notificationTypeId: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    clientId: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    jobCommentId: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    jobId: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    projectId: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    productId: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    refUserId: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    projectProgress: {
      type: Sequelize.INTEGER,
      defaultValue: null,
      allowNull: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  {
    underscored: true,
    defaultScope: {
      order: [['updatedAt', 'DESC']],
      where: {
        deleted: false,
      },
    },
    scopes: {
      pending: {
        where: {
          readStatusId: NotificationReadStatusTypeEnum.PENDING,
        },
      },
      done: {
        where: {
          readStatusId: NotificationReadStatusTypeEnum.DONE,
        },
      },
    },
  },
) as NotificationModelStatic;

export default Notification;

import { Job } from '@models/jobs/job';
import { Client } from '@models/client';
import { JobComment } from '@models/job_comment';
import { Project } from '@models/project';
import { Product } from '@models/product';
import { User } from '@models/user';

Notification.hasOne(Client, {
  as: 'client',
  foreignKey: {
    name: 'id',
    allowNull: true,
  },
  sourceKey: 'clientId',
});

Notification.hasOne(Job, {
  as: 'job',
  foreignKey: {
    name: 'id',
    allowNull: true,
  },
  sourceKey: 'jobId',
});

Notification.hasOne(JobComment, {
  as: 'jobComment',
  foreignKey: {
    name: 'id',
    allowNull: true,
  },
  sourceKey: 'jobCommentId',
});

Notification.hasOne(Project, {
  as: 'project',
  foreignKey: {
    name: 'id',
    allowNull: true,
  },
  sourceKey: 'projectId',
});

Notification.hasOne(Product, {
  as: 'product',
  foreignKey: {
    name: 'id',
    allowNull: true,
  },
  sourceKey: 'productId',
});

Notification.hasOne(User, {
  as: 'refUser',
  foreignKey: {
    name: 'id',
    allowNull: true,
  },
  sourceKey: 'refUserId',
});

Notification.hasOne(User, {
  as: 'user',
  foreignKey: {
    name: 'id',
    allowNull: false,
  },
  sourceKey: 'userId',
});

Notification.addScope('withClient', {
  include: [
    {
      as: 'client',
      required: false,
      model: Client.scope('forNotifications'),
    },
  ],
});

Notification.addScope('withJob', {
  include: [
    {
      as: 'job',
      required: false,
      model: Job.scope('basic'),
    },
  ],
});

Notification.addScope('withJobComment', {
  include: [
    {
      as: 'jobComment',
      model: JobComment.scope('forNotifications'),
    },
  ],
});

Notification.addScope('withProduct', {
  include: [
    {
      as: 'product',
      model: Product.scope('forNotifications'),
    },
  ],
});

Notification.addScope('withProject', {
  include: [
    {
      as: 'project',
      model: Project.scope('forNotifications'),
    },
  ],
});

Notification.addScope('withRefUser', {
  include: [
    {
      as: 'refUser',
      model: User.scope('forNotifications'),
    },
  ],
});

Notification.addScope('withUser', {
  include: [
    {
      as: 'user',
      model: User.scope('forNotifications'),
    },
  ],
});
