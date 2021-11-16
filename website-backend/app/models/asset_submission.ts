// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { AssetSubmissionAttributes, AssetSubmissionCreationAttributes } from '@types';
import { UnitTypeEnum } from '@enums';
import { UnitType } from '@models/unit_type';
import { sql } from '@root/sql';

import Errors from '@root/errors';

export interface AssetSubmissionInstance
  extends Model<AssetSubmissionAttributes, AssetSubmissionCreationAttributes>,
  AssetSubmissionAttributes {}

type AssetSubmissionModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionInstance;
  record(assetId: number, folder: string, userId: number): Promise<AssetSubmissionInstance>;
};

export const AssetSubmission = sql.define(
  'asset_submission',
  {
    assetId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date: {
      // I'm not sure if this is working as expected
      type: Sequelize.VIRTUAL,
      get(this: any): string {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('MM/DD/YYYY');
      },
    },
    depth: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    folder: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    hasReachedClient: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    height: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    lightCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 0,
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    submissionNumber: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    triangleCount: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    unitTypeId: {
      type: Sequelize.INTEGER,
      defaultValue: UnitTypeEnum.METERS,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    width: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
  },
  {
    scopes: {
      basic: {
        attributes: [
          'createdAt',
          'depth',
          'folder',
          'hasReachedClient',
          'height',
          'id',
          'submissionNumber',
          'updatedAt',
          'width',
        ],
      },
    },
  },
) as AssetSubmissionModelStatic;

export default AssetSubmission;

// Additional Includes
import { Asset } from '@models/asset';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import { AssetSubmissionIssueHotspot } from '@models/asset_submission_issue_hotspot';
import { AssetSubmissionIssueImage } from '@models/asset_submission_issue_image';
import { AssetSubmissionRender } from '@models/asset_submission_render';
import { AssetSubmissionStatusType } from '@models/asset_submission_status_type';
import { AssetSubmissionStatusTypeEnum } from '@enums';
import { AssetSubmissionTexture } from '@models/asset_submission_texture';
import { Product } from '@models/product';
import { User } from '@models/user';

// Scopes with includes
AssetSubmission.addScope('details', {
  attributes: [
    'createdAt',
    'depth',
    'folder',
    'hasReachedClient',
    'height',
    'id',
    'lightCount',
    'submissionNumber',
    'triangleCount',
    'updatedAt',
    'width',
  ],
  include: [
    {
      as: 'artist',
      attributes: ['id'],
      model: User,
    },
    {
      as: 'asset',
      attributes: ['id', 'name', 'uid'],
      include: [
        {
          as: 'product',
          attributes: ['asin'], // Need this for Amazon fbx download link
          model: Product,
        },
      ],
      model: Asset,
    },
    {
      as: 'openIssues',
      include: [
        {
          as: 'hotspots',
          model: AssetSubmissionIssueHotspot.scope('basic'),
        },
        {
          as: 'images',
          model: AssetSubmissionIssueImage.scope('basic'),
        },
      ],
      model: AssetSubmissionIssue.scope('open'),
      required: false,
    },
    {
      as: 'renders',
      attributes: ['filename'],
      model: AssetSubmissionRender,
      required: false,
    },
    {
      as: 'resolvedIssues',
      include: [
        {
          as: 'hotspots',
          model: AssetSubmissionIssueHotspot.scope('basic'),
        },
        {
          as: 'images',
          model: AssetSubmissionIssueImage.scope('basic'),
        },
      ],
      model: AssetSubmissionIssue.scope('resolved'),
      required: false,
    },
    {
      as: 'status',
      model: AssetSubmissionStatusType.scope('basic'),
    },
    {
      as: 'textures',
      attributes: ['filename'],
      model: AssetSubmissionTexture,
      required: false,
    },
    {
      as: 'units',
      model: UnitType,
    },
  ],
  order: [[Sequelize.col('renders.id'), 'DESC']],
});

AssetSubmission.addScope('hotspots', {
  attributes: ['id'],
  include: [
    {
      as: 'issues',
      include: [
        {
          as: 'hotspots',
          model: AssetSubmissionIssueHotspot.scope('basic'),
        },
      ],
      model: AssetSubmissionIssue.scope('basic'),
      required: false,
    },
  ],
});

// @ts-ignore
AssetSubmission.addScope('latestForAsset', (assetId: number) => ({
  where: { assetId: assetId },
  order: [['id', 'DESC']],
}));

AssetSubmission.record = function (assetId: number, folder: string, userId: number) {
  // Get the submission number and create a new entry
  return new Promise((resolve, reject) => {
    AssetSubmission.findAll({ where: { assetId: assetId } })
      .then(submissions => {
        const submissionCount = submissions.length + 1;
        return AssetSubmission.create({
          assetId: assetId,
          submissionNumber: submissionCount,
          folder: folder,
          userId: userId,
          statusId: AssetSubmissionStatusTypeEnum.INITIAL_SUBMISSION,
        })
          .then(submission => {
            resolve(submission);
          })
          .catch((err: Error) => {
            Errors.reject(reject, err, 'Unable to create Asset Submission for record');
          });
      })
      .catch((err: Error) => {
        Errors.reject(reject, err, 'Unable to find Asset Submissions for record');
      });
  });
};

AssetSubmission.hasOne(User, {
  as: 'artist',
  foreignKey: 'id',
  sourceKey: 'userId',
});

AssetSubmission.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});

AssetSubmission.hasMany(AssetSubmissionIssue, {
  as: 'issues',
  foreignKey: 'assetSubmissionId',
  sourceKey: 'id',
});

AssetSubmission.hasMany(AssetSubmissionIssue, {
  as: 'openIssues',
  foreignKey: 'assetSubmissionId',
  sourceKey: 'id',
});

AssetSubmission.hasMany(AssetSubmissionIssue, {
  as: 'resolvedIssues',
  foreignKey: 'assetSubmissionId',
  sourceKey: 'id',
});

AssetSubmission.hasMany(AssetSubmissionRender, {
  as: 'renders',
  foreignKey: 'assetSubmissionId',
  sourceKey: 'id',
});

AssetSubmission.hasMany(AssetSubmissionTexture, {
  as: 'textures',
  foreignKey: 'assetSubmissionId',
  sourceKey: 'id',
});

AssetSubmission.hasOne(AssetSubmissionStatusType, {
  as: 'status',
  foreignKey: 'id',
  sourceKey: 'statusId',
});

AssetSubmission.hasOne(UnitType, {
  as: 'units',
  foreignKey: 'id',
  sourceKey: 'unitTypeId',
});
