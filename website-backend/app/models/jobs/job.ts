// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import sequelize from 'sequelize';
import { BuildOptions, Model, Op, col, fn } from 'sequelize';
import { JobCreationAttributes, JobAttributes, NotificationEvent, TemplateRequest } from '@types';
import {
  NotificationTypeEnum,
  JobStatusTypeEnum,
  JobQualityTypeEnum,
  JobPriorityTypeEnum,
  EmailType,
  ProjectStatusTypesEnum,
} from '@enums';
import { JobPriorityType } from '@models/job_priority_type';
import { JobQualityType } from '@models/job_quality_type';
import { JobStatusType } from '@models/job_status_type';
import Helpers from '@root/helpers';
import Email from '@root/email/email';
import { sql } from '@root/sql';

import Log from '@root/log';

export interface JobInstance extends Model<JobAttributes, JobCreationAttributes>, JobAttributes {
  setStatus(statusId: JobStatusTypeEnum): Promise<any>;
}

type JobModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobInstance;
  createForProject(
    additionalDimensions: string,
    brandId: number,
    classId: number,
    clientId: number,
    dateDue: string | Date,
    materialInformation: string,
    modelingInstructions: string,
    notes: string,
    priorityId: number,
    productId: number,
    projectId: number,
    qualityId: number,
    price: number,
    studioId: number,
  ): Promise<string>;
  createForHoldingImport(payload: {
    brandId: number;
    classId: number;
    clientId: number;
    dateDue: string;
    priorityId: number;
    productId: number;
    projectId: number;
    qualityId: number;
  }): Promise<string>;
  findAllForAdminDashboard(): Promise<any[]>;
  findAllNeedingTechnicalQa(): Promise<any[]>;
  findAllForOpsDashboard(): Promise<any[]>;
  findAllForOpsData(): Promise<any[]>;
  findAllForUserDashboard(userId: number): Promise<any[]>;
  findBigCommerceJobsByClientIds(clientIds: number[]): Promise<JobInstance[]>;
};

export const Job = sql.define(
  'job',
  {
    additionalDimensions: {
      type: sequelize.TEXT,
    },
    billingMonth: {
      type: sequelize.INTEGER,
    },
    billingPlatformCharge: {
      type: sequelize.FLOAT,
    },
    brandId: {
      type: sequelize.INTEGER,
    },
    classId: {
      type: sequelize.INTEGER,
    },
    clientId: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    dateCompleted: {
      type: sequelize.DATE,
      defaultValue: null,
      get: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('dateCompleted')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('YYYY-MM-DD');
      },
    },
    dateDue: {
      type: sequelize.DATE,
      defaultValue: sequelize.NOW,
      get: function (this: any): string {
        return moment.utc(this.getDataValue('dateDue')).format('YYYY-MM-DD');
      },
    },
    deleted: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    materialInformation: {
      type: sequelize.TEXT,
    },
    modelingInstructions: {
      type: sequelize.TEXT,
    },
    notes: {
      type: sequelize.TEXT,
    },
    paid3xr: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    paidStudio: {
      type: sequelize.BOOLEAN,
      defaultValue: false,
    },
    price: {
      type: sequelize.FLOAT,
      defaultValue: 0,
    },
    priorityId: {
      type: sequelize.INTEGER,
      defaultValue: JobPriorityTypeEnum.STANDARD,
      allowNull: false,
    },
    productId: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    projectId: {
      type: sequelize.INTEGER,
      allowNull: true,
    },
    statusId: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: JobStatusTypeEnum.UNASSIGNED,
    },
    studioId: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1, // Assign to 3XR by default
    },
    qualityId: {
      type: sequelize.INTEGER,
      defaultValue: JobQualityTypeEnum.STANDARD,
    },
    uid: {
      type: sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    defaultScope: {
      where: { deleted: false },
    },
    getterMethods: {
      dateAdded: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('YYYY-MM-DD');
      },
      dayCompleted: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('dateCompleted')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('dddd, MMMM Do YYYY');
      },
      dayDue: function (this: any): string {
        return moment.utc(this.getDataValue('dateDue')).format('dddd, MMMM Do YYYY');
      },
      dateDueFormValue: function (this: any): string {
        return moment.utc(this.getDataValue('dateDue')).format('YYYY-MM-DD');
      },
      daySubmitted: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('dateSubmitted')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('dddd, MMMM Do YYYY');
      },
      lastUpdated: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('updatedAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('YYYY-MM-DD');
      },
      updatedAt: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('updatedAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('MM/DD/YYYY hh:mm:ssa z');
      },
    },
    scopes: {
      basic: {
        attributes: ['id', 'uid'],
        where: {
          deleted: false,
        },
      },
      forNotifications: {
        attributes: ['id', 'uid'],
      },
    },
  },
) as JobModelStatic;

export default Job;

// Additional Includes
import { Asset } from '@models/asset';
import { AssetFile } from '@models/asset_file';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import { AssetSubmissionRender } from '@models/asset_submission_render';
import { AssetSubmissionStatusType } from '@models/asset_submission_status_type';
import { Client } from '@models/client';
import { ClientBrand } from '@models/client_brand';
import { ClientClass } from '@models/client_class';
import { JobStatusLog } from '@models/job_status_log';
import { Product } from '@models/product';
import { ProductAdditionalFile } from '@models/product_additional_file';
import { ProductReferenceImage } from '@models/product_reference_image';
import { Project } from '@models/project';
import { ProjectStatusType } from '@models/project_status_type';
import { Studio } from '@models/studio';
import { UnitType } from '@models/unit_type';
import { User } from '@models/user';
import { UserClient } from '@models/user_client';
import {
  sendJobProgressNotification,
  getNotificationForProject,
  sendNotificationsToUserIds,
} from '@services/Notifications';
import { AssetSubmissionStatusTypeEnum } from '@enums';

// Scopes with includes
Job.addScope('billing', {
  attributes: ['billingMonth', 'billingPlatformCharge', 'paid3xr', 'paidStudio', 'price', 'projectId'],
  include: [
    {
      as: 'product',
      attributes: ['name', 'id', 'uid', 'partNumber'],
      model: Product,
    },
  ],
  order: [
    ['projectId', 'DESC'],
    [col('product.name'), 'ASC'],
  ],
});

Job.addScope('billingMonth', (month: number) => ({
  where: { billingMonth: month },
}));

//@ts-ignore
Job.addScope('preview', (uid: number) => ({
  attributes: [
    'additionalDimensions',
    'billingPlatformCharge',
    'clientId',
    'createdAt',
    'dateDue',
    'id',
    'notes',
    'materialInformation',
    'modelingInstructions',
    'price',
    'statusId',
    'uid',
    'updatedAt',
  ],
  include: [
    {
      as: 'product',
      attributes: [
        'artistUserId',
        'asin',
        'assetId',
        'blendName',
        'depth',
        'height',
        'id',
        'name',
        'partNumber',
        'unitTypeId',
        'uid',
        'url',
        'width',
      ],
      include: [
        {
          as: 'artist',
          model: User.scope('basic'),
        },
        {
          as: 'asset',
          attributes: ['id', 'name', 'uid', 'published'],
          include: [
            {
              as: 'submissions',
              include: [
                {
                  as: 'renders',
                  attributes: ['id', 'filename'],
                  model: AssetSubmissionRender,
                  required: false,
                },
              ],
              model: AssetSubmission.scope('basic'),
            },
            {
              as: 'files',
              model: AssetFile.scope('nameSizeType'),
            },
          ],
          model: Asset,
          required: false,
        },
        {
          as: 'additionalFiles',
          attributes: ['id', 'filename'],
          model: ProductAdditionalFile,
        },
        {
          as: 'referenceImages',
          attributes: ['id', 'filename', 'primary', 'sortWeight'],
          model: ProductReferenceImage,
        },
        {
          as: 'units',
          attributes: ['id', 'name'],
          model: UnitType,
        },
      ],
      model: Product,
    },
    {
      as: 'status',
      attributes: ['id', 'name'],
      model: JobStatusType,
    },
    {
      as: 'project',
      attributes: ['uid', 'name'],
      model: Project,
    },
    {
      as: 'brand',
      model: ClientBrand.scope('basic'),
    },
    {
      as: 'studio',
      model: Studio.scope('basic'),
    },
    {
      as: 'class',
      model: ClientClass.scope('basic'),
    },
  ],
  where: { uid: uid },
  order: [
    [col('product->referenceImages.sort_weight'), 'ASC'],
    [col('product.asset->submissions.id'), 'DESC'],
    [col('product.asset->submissions->renders.id'), 'DESC'],
  ],
}));

Job.addScope('projectDashboard', {
  attributes: [
    'additionalDimensions',
    'createdAt',
    'clientId',
    'dateCompleted',
    'dateDue',
    'id',
    'materialInformation',
    'modelingInstructions',
    'notes',
    'price',
    'uid',
  ],
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
      attributes: ['name', 'id', 'uid', 'depth', 'width', 'height', 'partNumber'],
      include: [
        {
          as: 'artist',
          model: User.scope('forPurchaseOrderProductsAsArtist'),
        },
        {
          as: 'asset',
          attributes: ['uid'],
          model: Asset,
        },
        {
          as: 'referenceImages',
          attributes: ['id', 'filename', 'sortWeight', 'primary', 'fallbackImageUrl'],
          model: ProductReferenceImage.scope('primary'),
          required: false,
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
  order: [['id', 'DESC']],
  where: { deleted: false },
});

Job.addScope('withModelDownloads', {
  include: [
    {
      as: 'product',
      attributes: ['name', 'uid', 'partNumber'],
      include: [
        {
          as: 'asset',
          attributes: ['uid', 'name'],
          include: [
            {
              attributes: ['filename', 'typeId'],
              as: 'files',
              model: AssetFile,
              where: {
                typeId: {
                  [Op.in]: [
                    4, // MODEL_USDZ,
                    5, //MODEL_GLB,
                    13, // FILE_TYPE.CRATE_AND_BARREL_ZIP
                  ],
                },
              },
            },
          ],
          model: Asset,
        },
      ],
      model: Product,
    },
  ],
});

Job.addScope('jobSearch', {
  attributes: ['uid', 'dateDue', 'updatedAt'],
  include: [
    {
      as: 'product',
      attributes: ['name', 'uid', 'partNumber'],
      include: [
        {
          as: 'asset',
          attributes: ['uid', 'name', 'published'],
          model: Asset,
        },
        {
          as: 'referenceImages',
          attributes: ['id', 'filename', 'primary', 'sortWeight'],
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
  order: [
    ['dateDue', 'DESC'],
    [col('product->referenceImages.sort_weight'), 'ASC'],
  ],
  where: { deleted: false },
});

// The CSV needs more data than the jobSearch results table
Job.addScope('jobSearchCSV', {
  attributes: ['createdAt', 'uid', 'dateDue', 'updatedAt', 'price'],
  include: [
    {
      as: 'brand',
      attributes: ['name'],
      model: ClientBrand,
    },
    {
      as: 'client',
      attributes: ['name'],
      model: Client,
    },
    {
      as: 'product',
      attributes: ['name', 'uid', 'partNumber'],
      include: [
        {
          as: 'additionalFiles',
          attributes: ['id', 'filename'],
          model: ProductAdditionalFile,
        },
        {
          as: 'artist',
          attributes: ['firstName', 'lastName'],
          model: User,
        },
        {
          as: 'asset',
          attributes: ['uid'],
          include: [
            {
              as: 'submissions',
              include: [
                {
                  as: 'issues',
                  attributes: ['authorUserId'],
                  include: [
                    {
                      as: 'author',
                      model: User.scope('basic'),
                    },
                  ],
                  model: AssetSubmissionIssue,
                  required: false,
                },
                {
                  as: 'status',
                  model: AssetSubmissionStatusType.scope('basic'),
                },
              ],
              model: AssetSubmission.scope('basic'),
            },
          ],
          model: Asset,
        },
        {
          as: 'referenceImages',
          attributes: ['id', 'filename', 'primary', 'sortWeight'],
          model: ProductReferenceImage,
        },
      ],
      model: Product,
    },
    {
      as: 'project',
      attributes: ['name'],
      model: Project,
    },
    {
      as: 'status',
      attributes: ['id', 'name'],
      model: JobStatusType,
    },
  ],
  order: [
    ['dateDue', 'DESC'],
    [col('product->referenceImages.sort_weight'), 'ASC'],
  ],
  where: { deleted: false },
});

Job.addScope('deadlineNoRisk', {
  where: {
    dateDue: {
      [Op.gt]: moment.tz(moment().add(3, 'days'), 'America/New_York').format('YYYY-MM-DD'),
    },
    deleted: false,
  },
});

Job.addScope('deadlinePastDue', {
  where: {
    dateDue: {
      [Op.lt]: moment.tz(moment.now(), 'America/New_York').format('YYYY-MM-DD'),
    },
    deleted: false,
  },
});

Job.addScope('deadlineRisk', {
  where: {
    dateDue: {
      [Op.between]: [
        moment.tz(moment().add(1, 'days'), 'America/New_York').format('YYYY-MM-DD'),
        moment.tz(moment().add(3, 'days'), 'America/New_York').format('YYYY-MM-DD'),
      ],
    },
    deleted: false,
  },
});

//@ts-ignore
Job.addScope('deadlineToday', {
  where: {
    dateDue: {
      //[Op.lte]: moment().subtract(1, 'days').toDate()
      [Op.eq]: moment.tz(moment.now(), 'America/New_York').format('YYYY-MM-DD'),
    },
    deleted: false,
  },
});

Job.addScope('statusCount', {
  group: ['statusId'],
  attributes: ['statusId', [fn('COUNT', 'statusId'), 'statusCount']],
  where: { deleted: false },
});

Job.addScope('details', {
  attributes: [
    'additionalDimensions',
    'billingPlatformCharge',
    'createdAt',
    'updatedAt',
    'clientId',
    'dateCompleted',
    'dateDue',
    'id',
    'materialInformation',
    'modelingInstructions',
    'notes',
    'price',
    'uid',
  ],
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
      as: 'priority',
      attributes: ['id', 'name'],
      model: JobPriorityType,
    },
    {
      as: 'product',
      attributes: [
        'artistUserId',
        'asin',
        'blendName',
        'depth',
        'height',
        'name',
        'modelingTypeId',
        'partNumber',
        'uid',
        'url',
        'width',
        'unitTypeId',
      ],
      model: Product,
      include: [
        {
          as: 'artist',
          model: User.scope('basic'),
        },
        {
          as: 'additionalFiles',
          attributes: ['id', 'filename'],
          model: ProductAdditionalFile,
        },
        {
          as: 'referenceImages',
          attributes: ['id', 'filename', 'primary', 'sortWeight', 'fallbackImageUrl'],
          model: ProductReferenceImage,
        },
        {
          as: 'units',
          attributes: ['id', 'name'],
          model: UnitType,
        },
      ],
    },
    {
      as: 'project',
      attributes: ['uid', 'name'],
      model: Project,
    },
    {
      as: 'status',
      attributes: ['id', 'name'],
      model: JobStatusType,
    },
    {
      as: 'studio',
      attributes: ['id', 'name', 'uid'],
      model: Studio,
    },
    {
      as: 'quality',
      attributes: ['id', 'name'],
      model: JobQualityType,
    },
  ],
  order: [[col('product->referenceImages.sort_weight'), 'ASC']],
  where: { deleted: false },
});

Job.addScope('emailArtist', {
  include: [
    {
      as: 'product',
      include: [
        {
          as: 'artist',
          model: User,
        },
        {
          as: 'asset',
          model: Asset,
        },
      ],
      model: Product,
      required: true,
    },
  ],
  where: { deleted: false },
});

Job.addScope('dateDueAfter', (date: Array<string>) => ({
  where: { dateDue: { [Op.gte]: date }, deleted: false },
}));

Job.addScope('dateDueBefore', (date: Array<string>) => ({
  where: { dateDue: { [Op.lte]: date }, deleted: false },
}));

Job.addScope('dateDueBetween', (dates: Array<string>) => ({
  where: { dateDue: { [Op.between]: dates }, deleted: false },
}));

Job.addScope('forArtist', (artistUserId: number) => ({
  include: [
    {
      as: 'product',
      attributes: [],
      model: Product,
      where: { artistUserId: artistUserId },
    },
  ],
  where: { deleted: false },
}));

Job.addScope('forAsset', (assetId: number) => ({
  include: [
    {
      as: 'product',
      include: [
        {
          as: 'asset',
          model: Asset,
          where: { id: assetId },
        },
      ],
      model: Product,
      required: true,
    },
  ],
  where: { deleted: false },
}));

Job.addScope('forBrand', (brandId: number) => ({
  where: { brandId: brandId, deleted: false },
}));

Job.addScope('forClass', (classId: number) => ({
  where: { classId: classId, deleted: false },
}));

Job.addScope('forClient', (clientId: number) => ({
  where: { clientId: clientId, deleted: false },
}));

Job.addScope('forClients', (clientIds: number[]) => ({
  where: { clientId: { [Op.in]: clientIds }, deleted: false },
}));

Job.addScope('forClientByUserRaw', (userId: number) => ({
  include: [
    {
      as: 'client',
      attributes: [],
      include: [
        {
          as: 'users',
          attributes: [],
          model: User,
          through: { attributes: [] },
          where: { id: userId },
        },
      ],
      model: Client,
      required: true,
    },
  ],
  raw: true, // needed with statusCount grouping
  where: { deleted: false },
}));

Job.addScope('forProductUid', (productUid: string) => ({
  include: [
    {
      as: 'product',
      model: Product,
      required: true,
      where: { uid: productUid },
    },
  ],
  where: { deleted: false },
}));

Job.addScope('forStudios', (studioIds: number[]) => ({
  where: { studioId: { [Op.in]: studioIds }, deleted: false },
}));

Job.addScope('groupByStatus', {
  group: ['statusId'],
  attributes: ['statusId', [fn('COUNT', 'statusId'), 'statusCount']],
  where: { deleted: false },
});

Job.addScope('open', {
  where: {
    deleted: false,
    statusId: {
      [Op.in]: [
        JobStatusTypeEnum.ASSIGNED,
        JobStatusTypeEnum.IN_PROGRESS,
        JobStatusTypeEnum.SELF_QA,
        JobStatusTypeEnum.TECHNICAL_QA,
        JobStatusTypeEnum.REVISION_NEEDED,
        JobStatusTypeEnum.IN_REWORK,
        JobStatusTypeEnum.CLIENT_QA,
      ],
    },
  },
});

Job.addScope('forComments', (jobUid: string) => {
  return {
    attributes: ['clientId', 'productId', 'projectId'],
    include: [
      {
        as: 'product',
        include: [
          {
            as: 'artist',
            model: User.scope('basic'),
          },
        ],
        model: Product,
      },
    ],
    where: { uid: jobUid },
  };
});

Job.addScope('searchByProductName', (searchString: string) => {
  return {
    attributes: [],
    include: [
      {
        attributes: [],
        as: 'product',
        where: { name: { [Op.iLike]: '%' + searchString + '%' } },
        model: Product,
      },
    ],
  };
});

Job.addScope('searchExcludingProductName', (searchString: string) => {
  return {
    attributes: [],
    include: [
      {
        attributes: [],
        as: 'product',
        where: { name: { [Op.notILike]: '%' + searchString + '%' } },
        model: Product,
      },
    ],
  };
});

// need to get date of approval. could use job status log, but filter won't work
// using updatedAt date instead
/*
Job.addScope('withDateApproved', () => ({
  include: [
    {
      as: 'statusLogs',
      attributes: ['createdAt'],
      model: JobStatusLog,
      where: { statusId: 9 },
    },
  ],
}));
*/

Job.addScope('updatedAtAfter', (date: Array<string>) => ({
  where: { updatedAt: { [Op.gte]: date }, deleted: false },
}));

Job.addScope('updatedAtBefore', (date: Array<string>) => ({
  where: { updatedAt: { [Op.lte]: date }, deleted: false },
}));

Job.addScope('updatedAtBetween', (dates: Array<string>) => ({
  where: { updatedAt: { [Op.between]: dates }, deleted: false },
}));

Job.addScope('withDimensions', {
  include: [
    {
      as: 'product',
      attributes: ['height', 'width', 'depth'],
      include: ['units'],
      model: Product,
    },
  ],
});

Job.addScope('withProjects', (projectIds: number[]) => ({
  where: { deleted: false, projectId: { [Op.in]: projectIds } },
}));

Job.addScope('withStatus', (statusId: number) => ({
  where: { deleted: false, statusId: statusId },
}));

Job.addScope('withStatuses', (statusIds: number[]) => ({
  where: { deleted: false, statusId: { [Op.in]: statusIds } },
}));

// Joins
Job.hasOne(Client, {
  as: 'client',
  foreignKey: 'id',
  sourceKey: 'clientId',
});
Job.hasOne(ClientBrand, {
  as: 'brand',
  foreignKey: 'id',
  sourceKey: 'brandId',
});
Job.hasOne(ClientClass, {
  as: 'class',
  foreignKey: 'id',
  sourceKey: 'classId',
});
Job.hasOne(JobPriorityType, {
  as: 'priority',
  foreignKey: 'id',
  sourceKey: 'priorityId',
});
Job.hasMany(JobStatusLog, {
  as: 'statusLogs',
  foreignKey: 'jobId',
  sourceKey: 'id',
});
Job.hasOne(Product, {
  as: 'product',
  foreignKey: 'id',
  sourceKey: 'productId',
});
Job.hasOne(Project, {
  as: 'project',
  foreignKey: 'id',
  sourceKey: 'projectId',
});
Job.hasOne(JobStatusType, {
  as: 'status',
  foreignKey: 'id',
  sourceKey: 'statusId',
});
Job.hasOne(JobQualityType, {
  as: 'quality',
  foreignKey: 'id',
  sourceKey: 'qualityId',
});
Job.hasOne(Studio, {
  as: 'studio',
  foreignKey: 'id',
  sourceKey: 'studioId',
});

Job.createForProject = (
  additionalDimensions: string,
  brandId: number,
  classId: number,
  clientId: number,
  dateDue: string,
  materialInformation: string,
  modelingInstructions: string,
  notes: string,
  priorityId: number,
  productId: number,
  projectId: number,
  qualityId: number,
  price: number,
  studioId: number,
) => {
  return new Promise((resolve, reject) => {
    Helpers.getNewUidForModel(Job, 12)
      .then((jobUid: string) => {
        Job.create({
          additionalDimensions: additionalDimensions,
          brandId: brandId,
          classId: classId,
          clientId: clientId,
          dateDue: dateDue,
          materialInformation: materialInformation,
          modelingInstructions: modelingInstructions,
          notes: notes,
          price: price || 0, // null price from csv was being sent as an empty string
          priorityId: priorityId,
          productId: productId,
          projectId: projectId,
          qualityId: qualityId,
          studioId: studioId,
          uid: jobUid,
        })
          .then((job: any) => {
            // Log the initial status
            JobStatusLog.create({
              jobId: job.id,
              statusId: JobStatusTypeEnum.UNASSIGNED,
            })
              .then((statusLog: any) => {
                resolve(jobUid);
              })
              .catch((err: Error) => {
                Log.error(err);
                reject(err);
              });
          })
          .catch((err: Error) => {
            Log.error(err);
            reject(err);
          });
      })
      .catch((err: Error) => {
        Log.error(err);
        reject(err);
      });
  });
};

Job.createForHoldingImport = (payload: {
  brandId: number;
  classId: number;
  clientId: number;
  dateDue: string;
  priorityId: number;
  productId: number;
  projectId: number;
  qualityId: number;
}) => {
  return new Promise((resolve, reject) => {
    Helpers.getNewUidForModel(Job, 12)
      .then((jobUid: string) => {
        Job.create({
          brandId: payload.brandId,
          classId: payload.classId,
          clientId: payload.clientId,
          dateDue: payload.dateDue,
          materialInformation: '',
          modelingInstructions: '',
          notes: '',
          priorityId: payload.priorityId,
          productId: payload.productId,
          projectId: payload.projectId,
          qualityId: payload.qualityId,
          statusId: JobStatusTypeEnum.PENDING_REVIEW,
          studioId: 1, // Holding Import is not in use. Assign to 3XR to make TS happy
          uid: jobUid,
        })
          .then((job: any) => {
            // Log the initial status
            JobStatusLog.create({
              jobId: job.id,
              statusId: JobStatusTypeEnum.PENDING_REVIEW,
            })
              .then((statusLog: any) => {
                resolve(jobUid);
              })
              .catch((err: Error) => {
                Log.error(err);
                reject(err);
              });
          })
          .catch((err: Error) => {
            Log.error(err);
            reject(err);
          });
      })
      .catch((err: Error) => {
        Log.error(err);
        reject(err);
      });
  });
};

Job.findAllForAdminDashboard = () => {
  // TODO: convert to a scope
  return new Promise((resolve, reject) => {
    Job.findAll({
      attributes: ['createdAt', 'uid', 'dateDue'],
      include: [
        {
          attributes: ['name', 'uid'],
          as: 'product',
          include: [
            {
              as: 'additionalFiles',
              attributes: ['id', 'filename'],
              model: ProductAdditionalFile,
            },
            {
              as: 'asset',
              attributes: ['uid'],
              include: [
                {
                  as: 'submissions',
                  include: [
                    {
                      as: 'status',
                      model: AssetSubmissionStatusType.scope('basic'),
                    },
                  ],
                  model: AssetSubmission.scope('basic'),
                },
              ],
              model: Asset,
            },
            {
              as: 'referenceImages',
              attributes: ['id', 'filename', 'primary', 'sortWeight'],
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
      order: [
        ['dateDue', 'DESC'],
        [col('product->referenceImages.sort_weight'), 'ASC'],
      ],
      where: { deleted: false },
    })
      .then(jobs => {
        resolve(jobs);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

Job.findAllNeedingTechnicalQa = () => {
  return new Promise((resolve, reject) => {
    Job.findAll({
      attributes: ['createdAt', 'uid', 'dateDue'],
      include: [
        {
          as: 'product',
          attributes: ['name', 'uid'],
          include: [
            {
              as: 'additionalFiles',
              attributes: ['id', 'filename'],
              model: ProductAdditionalFile,
            },
            {
              as: 'referenceImages',
              attributes: ['id', 'filename', 'primary', 'sortWeight'],
              model: ProductReferenceImage,
            },
            {
              as: 'asset',
              attributes: ['uid'],
              include: [
                {
                  as: 'submissions',
                  model: AssetSubmission.scope('basic'),
                  where: {
                    statusId: AssetSubmissionStatusTypeEnum.READY_FOR_QA,
                  },
                  required: true,
                },
              ],
              model: Asset,
              required: true,
            },
          ],
          model: Product,
          required: true,
        },
        {
          attributes: ['id', 'name'],
          model: JobStatusType,
          as: 'status',
        },
      ],
      order: [
        [col('product->asset->submissions.created_at'), 'DESC'],
        [col('product->referenceImages.sort_weight'), 'ASC'],
      ],
      where: { deleted: false },
    })
      .then(jobs => {
        resolve(jobs);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

// TODO: use scopes
Job.findAllForOpsDashboard = () => {
  return Job.findAll({
    include: [
      {
        as: 'product',
        include: [
          {
            as: 'artist',
            model: User,
          },
          {
            as: 'asset',
            include: [
              {
                as: 'submissions',
                include: [
                  {
                    as: 'openIssues',
                    model: AssetSubmissionIssue,
                    where: { resolved: false },
                  },
                  {
                    as: 'resolvedIssues',
                    model: AssetSubmissionIssue,
                    where: { resolved: true },
                  },
                ],
                model: AssetSubmission.scope('basic'),
              },
            ],
            model: Asset,
          },
        ],
        model: Product,
      },
      {
        as: 'priority',
        model: JobPriorityType,
      },
      {
        as: 'project',
        model: Project,
        include: [
          {
            as: 'brand',
            model: ClientBrand,
          },
          {
            as: 'client',
            model: Client,
          },
          {
            as: 'status',
            model: ProjectStatusType,
          },
        ],
      },
      {
        as: 'quality',
        model: JobQualityType,
      },
      {
        as: 'status',
        model: JobStatusType,
      },
      {
        as: 'statusLogs',
        model: JobStatusLog,
      },
    ],
    order: [
      ['productId', 'DESC'],
      [col('product->asset->submissions.id'), 'DESC'],
      [col('statusLogs.id'), 'DESC'],
    ],
    where: { deleted: false },
  });
};

Job.findAllForOpsData = () => {
  return new Promise((resolve, reject) => {
    Job.findAll({
      attributes: [
        ['created_at', 'Date Added'],
        ['date_due', 'Due Date'],
        ['updated_at', 'Last Updated'],
      ],
      include: [
        {
          as: 'client',
          model: Client,
          required: true,
          attributes: [['name', 'Client']],
        },
        {
          as: 'brand',
          model: ClientBrand,
          required: false,
          attributes: [['name', 'Brand']],
        },
        {
          as: 'project',
          model: Project,
          required: true,
          attributes: [['name', 'Purchase Order']],
        },
        {
          as: 'product',
          model: Product,
          required: true,
          attributes: [
            ['name', 'Product Name'],
            ['part_number', 'Part Number'],
          ],
          include: [
            {
              as: 'artist',
              model: User,
              required: false,
              attributes: [['username', 'Artist']],
            },
            // {
            //   as: 'submissions',
            //   model: AssetSubmission,
            //   // required: false,
            //   attributes: [['submission_number', '# of Submissions']]
            // }
          ],
        },
        {
          as: 'status',
          model: JobStatusType,
          required: true,
          attributes: [['name', 'Status']],
        },
      ],
      order: ['updated_at'],
      where: { deleted: false },
    })
      .then(jobs => {
        resolve(jobs);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

// TODO: use scopes
Job.findAllForUserDashboard = (userId: number) => {
  return new Promise((resolve, reject) => {
    Job.findAll({
      attributes: ['createdAt', 'id', 'uid', 'dateDue'],
      include: [
        {
          as: 'product',
          attributes: ['name', 'id', 'uid'],
          model: Product,
          include: [
            {
              as: 'additionalFiles',
              attributes: ['id', 'filename'],
              model: ProductAdditionalFile,
            },
            {
              as: 'referenceImages',
              attributes: ['id', 'filename', 'primary', 'sortWeight'],
              model: ProductReferenceImage,
            },
            {
              attributes: ['id', 'uid'],
              include: [{ as: 'submissions', model: AssetSubmission.scope('basic') }],
              model: Asset,
              as: 'asset',
            },
          ],
          where: { artistUserId: userId },
        },
        {
          attributes: ['id', 'name'],
          model: JobStatusType,
          as: 'status',
        },
      ],
      order: [
        ['dateDue', 'DESC'],
        [col('product->referenceImages.sort_weight'), 'ASC'],
      ],
      where: { deleted: false },
    })
      .then(jobs => {
        resolve(jobs);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

Job.prototype.setStatus = async function (statusId: JobStatusTypeEnum) {
  if (this.statusId == statusId) return null;
  this.statusId = statusId;
  if (this.statusId > 3 && this.billingMonth <= 0) {
    // Set the billing month only if it hasn't already been set.
    const d = new Date();
    this.billingMonth = d.getFullYear().toString() + (d.getMonth() + 1).toString().padStart(2, '0');
  }
  try {
    await this.save();
    await JobStatusLog.create({
      jobId: this.id,
      statusId,
    });
    // create notification
    if (this.statusId === JobStatusTypeEnum.CLIENT_QA) {
      const userClients = await UserClient.findAll({
        where: {
          clientId: this.clientId,
        },
      });
      const userIds = userClients.map(({ userId }) => userId);
      sendNotificationsToUserIds(userIds, {
        notificationTypeId: NotificationTypeEnum.JOB_UPDATED_TO_CLIENT_QA,
        productId: this.productId,
      });

      // send CLIENT_QA notification email to all users associated with client ID
      const users = await Promise.all(userClients.map(async ({ userId }) => User.findByPk(userId)));
      const product = await Product.findByPk(this.productId);

      if (!product) {
        return;
      }

      const templateRequests: TemplateRequest[] = users.filter(Helpers.notNullPredicate).map(user => ({
        type: EmailType.CLIENT_QA,
        user,
        product: {
          name: product.name,
          href: `https://www.3xr.com/product/review/${product.uid}`,
        },
        bcc: [],
      }));

      const emailRequests = await Email.generateTemplates(templateRequests);
      if (emailRequests) {
        await Email.sendEmails(emailRequests);
      }
    }

    // send JOB_IN_REVISION notification email to all users associated with client ID
    if (this.statusId === JobStatusTypeEnum.REVISION_NEEDED) {
      const userClients = await UserClient.findAll({
        where: {
          clientId: this.clientId,
        },
      });
      const users = await Promise.all(userClients.map(async ({ userId }) => User.findByPk(userId)));
      const product = await Product.findByPk(this.productId);

      if (!product) {
        return;
      }

      const templateRequests: TemplateRequest[] = users.filter(Helpers.notNullPredicate).map(user => ({
        type: EmailType.JOB_IN_REVISION,
        user,
        product: {
          name: product.name,
          href: `https://www.3xr.com/product/review/${product.uid}`,
        },
        bcc: [],
      }));

      const emailRequests = await Email.generateTemplates(templateRequests);

      if (emailRequests) {
        await Email.sendEmails(emailRequests);
      }
    }

    // create Purchase Order status notification
    const project = await Project.findByPk(this.projectId);

    if (!project) {
      return;
    }

    const notification: NotificationEvent | null = await getNotificationForProject(project);
    if (notification) {
      if (!project.notificationStatusId || notification.status > project.notificationStatusId) {
        await sendJobProgressNotification(notification);
        project.notificationStatusId = notification.status;
        await project.save();
      }
    }

    // update project status
    const jobs = await Job.findAll({
      where: {
        projectId: this.projectId,
      },
    });
    const completionMap = Helpers.getProjectCompletionMap(jobs);
    const newStatusId = Helpers.getNewProjectStatus(completionMap, project.statusId);

    if (newStatusId && newStatusId !== project.statusId) {
      project.statusId = newStatusId;
      await project.save();

      if (newStatusId === ProjectStatusTypesEnum.IN_PROGRESS) {
        const userClients = await UserClient.findAll({
          where: {
            clientId: this.clientId,
          },
        });
        const users = await Promise.all(userClients.map(async ({ userId }) => User.findByPk(userId)));

        const templateRequests: TemplateRequest[] = users.filter(Helpers.notNullPredicate).map(user => ({
          type: EmailType.PO_IN_PROGRESS,
          user,
          project: {
            name: project.name,
            href: `https://www.3xr.com/client/purchase-order/products/${project.uid}`,
          },
          bcc: [],
        }));

        const emailRequests = await Email.generateTemplates(templateRequests);

        if (emailRequests) {
          await Email.sendEmails(emailRequests);
        }
      }
    }

    return null;
  } catch (err) {
    console.error(err);
    throw new Error(err as string);
  }
};

Job.findBigCommerceJobsByClientIds = async (clientIds: number[]): Promise<JobInstance[]> => {
  const jobs = await Job.findAll({
    attributes: ['createdAt', 'id', 'uid', 'dateDue', 'statusId'],
    include: [
      {
        as: 'product',
        attributes: [
          'bcProductId',
          'depth',
          'height',
          'id',
          'modelingTypeId',
          'name',
          'partNumber',
          'uid',
          'unitTypeId',
          'width',
        ],
        model: Product,
        include: [
          {
            attributes: ['id', 'uid'],
            include: [{ as: 'submissions', model: AssetSubmission.scope('basic') }],
            model: Asset,
            as: 'asset',
          },
        ],
        where: { bc_product_id: { [Op.ne]: null } },
      },
      {
        attributes: ['id', 'name'],
        model: JobStatusType,
        as: 'status',
      },
    ],
    order: [['dateDue', 'DESC']],
    where: { deleted: false, clientId: clientIds },
  });
  return jobs;
};
