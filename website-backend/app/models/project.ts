// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { BuildOptions, Model, Op } from 'sequelize';
import { ProjectCreationAttributes, ProjectAttributes } from '@types';
import { ProjectStatusTypesEnum } from '@enums';
import { Client } from '@models/client'; // Hope no circular reference
import { ProjectStatusType } from '@models/project_status_type';
import { sql } from '@root/sql';

const op = Sequelize.Op;

export interface ProjectInstance extends Model<ProjectAttributes, ProjectCreationAttributes>, ProjectAttributes {}

type ProjectModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProjectInstance;
};

// Note that projects are called Purchase Orders for the client on the frontend
export const Project = sql.define(
  'project',
  {
    clientId: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    },
    dateCompleted: {
      type: Sequelize.DATE,
      get: function (this: any) {
        if (!this.getDataValue('dateCompleted')) {
          return '';
        }
        const utc_date = moment.utc(this.getDataValue('dateCompleted')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('YYYY-MM-DD');
      },
    },
    dateDue: {
      type: Sequelize.DATE,
      get: function (this: any) {
        return moment.utc(this.getDataValue('dateDue')).format('YYYY-MM-DD');
      },
    },
    defaultArtistId: {
      type: Sequelize.INTEGER,
    },
    defaultBrand: {
      type: Sequelize.INTEGER,
    },
    isCreatedFromHolding: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    defaultClass: {
      type: Sequelize.INTEGER,
    },
    defaultPrice: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    defaultPriority: {
      type: Sequelize.INTEGER,
    },
    defaultQuality: {
      type: Sequelize.INTEGER,
    },
    defaultUnitType: {
      type: Sequelize.INTEGER,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    notificationStatusId: {
      type: Sequelize.INTEGER,
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    studioId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    uid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },


  },
  {
    defaultScope: {
      where: {
        deleted: false,
      },
    },
    scopes: {
      forNotifications: {
        attributes: ['id', 'name', 'uid'],
      },
      admin_view: {
        where: {
          [op.or]: [
            {
              statusId: ProjectStatusTypesEnum.IN_PROGRESS,
            },
            {
              statusId: ProjectStatusTypesEnum.COMPLETE,
            },
          ],
        },
      },
    },
    getterMethods: {
      dateAdded: function (this: any) {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('MM/DD/YYYY');
      },
      dayCompleted: function (this: any) {
        if (!this.getDataValue('dateCompleted')) {
          return '';
        }
        const utc_date = moment.utc(this.getDataValue('dateCompleted')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('dddd, MMMM Do YYYY');
      },
      dayDue: function (this: any) {
        return moment.utc(this.getDataValue('dateDue')).format('dddd, MMMM Do YYYY');
      },
    },
  },
) as ProjectModelStatic;

export default Project;

// Additional Includes
import { Asset } from '@models/asset';
import { AssetSubmission } from '@models/asset_submission';
import { ClientBrand } from '@models/client_brand';
import { ClientClass } from '@models/client_class';
import { Job } from '@models/jobs/job';
import { JobPriorityType } from '@models/job_priority_type';
import { JobStatusType } from '@models/job_status_type';
import { JobQualityType } from '@models/job_quality_type';
import { Product } from '@models/product';
import { ProductReferenceImage } from '@models/product_reference_image';
import { Studio } from '@models/studio';
import { UnitType } from '@models/unit_type';
import { User } from '@models/user';
import { UserClient } from '@models/user_client';

// Scopes with includes
Project.addScope('details', {
  attributes: ['updatedAt', 'dateCompleted', 'dateDue', 'id', 'name', 'uid', 'isCreatedFromHolding', 'defaultPrice'],
  include: [
    { as: 'artist', model: User.scope('basic'), required: false },
    { as: 'brand', model: ClientBrand.scope('basic'), required: false },
    { as: 'class', model: ClientClass.scope('basic'), required: false },
    { as: 'client', model: Client.scope('basic') },
    { as: 'jobs', model: Job.scope('basic'), required: false },
    { as: 'priority', model: JobPriorityType.scope('basic') },
    { as: 'status', model: ProjectStatusType.scope('basic') },
    { as: 'studio', model: Studio.scope('basic') },
    { as: 'quality', model: JobQualityType.scope('basic') },
    { as: 'units', model: UnitType.scope('basic') },
  ],
  order: [
    ['updatedAt', 'DESC'],
  ],
});

Project.addScope('forAssetUid', (assetUid: string) => ({
  include: [
    {
      as: 'jobs',
      attributes: [],
      include: [
        {
          as: 'product',
          attributes: [],
          include: [
            {
              as: 'asset',
              attributes: [],
              model: Asset,
              where: { uid: assetUid },
            }
          ],
          model: Product,
        }
      ],
      model: Job,
    }
  ]
}));

Project.addScope('forClients', (clientIds: number[]) => ({
  where: { clientId: { [Op.in]: clientIds } },
}));

Project.addScope('forStudios', (studioIds: number[]) => ({
  where: { studioId: { [Op.in]: studioIds } },
}));

Project.addScope('picklist', {
  attributes: ['id', 'name'],
  order: [
    ['updatedAt', 'DESC'],
  ],
});

Project.addScope('resultsTable', {
  attributes: [
    'dateDue',
    'name',
    'uid',
    'updatedAt',
    'statusId',
    [Sequelize.literal('(SELECT COUNT(*) FROM "jobs" WHERE "jobs"."project_id" = project.id AND "jobs"."deleted" = false)'), 'jobCount']
  ],
  include: [
    {
      as: 'status',
      attributes: ['id', 'name'],
      model: ProjectStatusType,
    },
  ],
  where: { deleted: false },
  order: [['updatedAt', 'DESC']],
});

Project.addScope('withClient', {
  attributes: ['clientId'],
  include: [
    {
      as: 'client',
      attributes: ['name'],
      model: Client,
    },
  ],
});

Project.addScope('withStudio', {
  attributes: ['studioId'],
  include: [
    {
      as: 'studio',
      attributes: ['name'],
      model: Studio,
    },
  ],
});

// Joins
Project.hasOne(User, {
  as: 'artist',
  foreignKey: 'id',
  sourceKey: 'defaultArtistId',
});
Project.hasOne(ClientBrand, {
  as: 'brand',
  foreignKey: 'id',
  sourceKey: 'defaultBrand',
});
Project.hasOne(Client, {
  as: 'client',
  foreignKey: 'id',
  sourceKey: 'clientId',
});
Project.hasOne(ClientClass, {
  as: 'class',
  foreignKey: 'id',
  sourceKey: 'defaultClass',
});
Project.hasMany(Job, {
  as: 'jobs',
  foreignKey: 'projectId',
  sourceKey: 'id',
});
Project.hasOne(JobPriorityType, {
  as: 'priority',
  foreignKey: 'id',
  sourceKey: 'defaultPriority',
});
Project.hasOne(JobQualityType, {
  as: 'quality',
  foreignKey: 'id',
  sourceKey: 'defaultQuality',
});
Project.hasOne(ProjectStatusType, {
  as: 'status',
  foreignKey: 'id',
  sourceKey: 'statusId',
});
Project.hasOne(Studio, {
  as: 'studio',
  foreignKey: 'id',
  sourceKey: 'studioId',
});
Project.hasOne(UnitType, {
  as: 'units',
  foreignKey: 'id',
  sourceKey: 'defaultUnitType',
});

// Scoped Includes (here to prevent circular references)

Project.addScope('adminDashboard', {
  // TODO: are getters included or not? dateAdded does not appear to be
  attributes: ['createdAt', 'dateCompleted', 'dateDue', 'id', 'name', 'uid'],
  include: [
    {
      as: 'artist',
      model: User.scope('basic'),
    },
    {
      as: 'class',
      model: ClientClass.scope('basic'),
    },
    {
      as: 'client',
      model: Client.scope('basic'),
    },
    {
      as: 'brand',
      attributes: ['id', 'name'],
      model: ClientBrand,
      required: false,
    },
    {
      as: 'jobs',
      attributes: ['createdAt', 'dateDue', 'id', 'price', 'uid'],
      include: [
        {
          as: 'brand',
          attributes: ['id', 'name'],
          model: ClientBrand,
        },
        {
          as: 'class',
          attributes: ['id', 'name'],
          model: ClientClass,
        },
        {
          as: 'product',
          attributes: ['id', 'name', 'uid', 'depth', 'height', 'width', 'partNumber'],
          include: [
            {
              as: 'asset',
              attributes: ['id', 'uid'],
              include: [{ as: 'submissions', model: AssetSubmission.scope('basic') }],
              model: Asset,
            },
            {
              as: 'artist',
              model: User.scope('forPurchaseOrderProductsAsArtist'),
            },
            {
              as: 'referenceImages',
              attributes: ['filename', 'id', 'sortWeight', 'primary'],
              model: ProductReferenceImage,
            },
          ],
          model: Product,
        },
        {
          as: 'status',
          attributes: ['id', 'name'],
          model: JobStatusType,
        },
      ],
      model: Job, //.scope('adminDashboard'), // Nested Scopes not working as expected
      required: false,
    },
    {
      as: 'priority',
      attributes: ['id', 'name'],
      model: JobPriorityType,
      required: false,
    },
    {
      as: 'quality',
      attributes: ['id', 'name'],
      model: JobQualityType,
      required: false,
    },
    {
      as: 'status',
      attributes: ['id', 'name'],
      model: ProjectStatusType,
    },
    {
      as: 'units',
      attributes: ['id', 'name'],
      model: UnitType,
    },
  ],
  order: [
    ['date_due', 'DESC'],
    [Sequelize.col('jobs->product->referenceImages.sort_weight'), 'ASC'],
  ],
});

Project.prototype.isUserAuthorized = async function (userId: number) {
  const userClients: Array<number> = await UserClient.getUserClientIds(userId);
  return userClients.includes(this.clientId);
}
