// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetSubmissionIssueAttributes, AssetSubmissionIssueCreationAttributes } from '@types';
import { RoleEnum } from '@enums';
import { AssetSubmission } from '@models/asset_submission';
import { Role } from '@models/role';
import { sql } from '@root/sql';

interface AssetSubmissionIssueInstance
  extends Model<AssetSubmissionIssueAttributes, AssetSubmissionIssueCreationAttributes>,
  AssetSubmissionIssueAttributes {}

type AssetSubmissionIssueModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionIssueInstance;
};

export const AssetSubmissionIssue = sql.define(
  'asset_submission_issue',
  {
    assetSubmissionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    authorUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    authorRoleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: RoleEnum.QA,
    },
    issueTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    imageCategory: {
      // TODO: this will refer to a Render, Product Image, Texture, etc.
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    imageId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    imageX: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    imageY: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    resolved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    resolutionTime: {
      type: Sequelize.DATE,
    },
    response: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
  },
  {
    defaultScope: {
      where: { deleted: false },
    },
    getterMethods: {
      createdAt: function (this: any) {
        const utcDate = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utcDate, 'America/New_York').format('MM/DD/YYYY hh:mm:ssa z');
      },
      resolutionTime: function (this: any) {
        const dataValue = this.getDataValue('resolutionTime');
        if (dataValue) {
          const utcDate = moment.utc(dataValue).toDate();
          return moment.tz(utcDate, 'America/New_York').format('MM/DD/YYYY hh:mm:ssa z');
        }
        return '';
      },
      updatedAt: function (this: any) {
        const utcDate = moment.utc(this.getDataValue('updatedAt')).toDate();
        return moment.tz(utcDate, 'America/New_York').format('MM/DD/YYYY hh:mm:ssa z');
      },
    },
    scopes: {
      basic: {
        attributes: ['id', 'description', 'response', 'resolved'],
        where: { deleted: false },
      },
      client: {
        where: { authorRoleId: RoleEnum.CLIENT },
      },
      open: {
        where: { resolved: false, deleted: false },
      },
      resolved: {
        where: { resolved: true, deleted: false },
      },
      qa: {
        where: { authorRoleId: RoleEnum.QA },
      },
    },
  },
) as AssetSubmissionIssueModelStatic;

export default AssetSubmissionIssue;

// Additional Includes
import { AssetSubmissionIssueHotspot } from '@models/asset_submission_issue_hotspot';
import { AssetSubmissionIssueImage } from '@models/asset_submission_issue_image';
import { AssetSubmissionIssueType } from '@models/asset_submission_issue_type';
import { AssetSubmissionIssueCategoryType } from '@models/asset_submission_issue_category_type';
import { User } from '@models/user';

// Scopes with includes
AssetSubmissionIssue.addScope('details', {
  attributes: ['description', 'response', 'resolved'],
  include: [
    {
      as: 'author',
      attributes: ['firstName', 'lastName', 'username'],
      model: User,
    },
    {
      as: 'hotspots',
      model: AssetSubmissionIssueHotspot.scope('basic'),
    },
    {
      as: 'images',
      model: AssetSubmissionIssueImage.scope('basic'),
    },
    {
      as: 'type',
      attributes: ['id'],
      include: [
        {
          as: 'category',
          attributes: ['id'],
          model: AssetSubmissionIssueCategoryType,
        },
      ],
      model: AssetSubmissionIssueType,
    },
  ],
  where: { deleted: false },
});

AssetSubmissionIssue.hasOne(AssetSubmission, {
  as: 'submission',
  foreignKey: 'id',
  sourceKey: 'assetSubmissionId',
});

AssetSubmissionIssue.hasMany(AssetSubmissionIssueHotspot, {
  as: 'hotspots',
  foreignKey: 'assetSubmissionIssueId',
  sourceKey: 'id',
});

AssetSubmissionIssue.hasMany(AssetSubmissionIssueImage, {
  as: 'images',
  foreignKey: 'assetSubmissionIssueId',
  sourceKey: 'id',
});

AssetSubmissionIssue.hasOne(AssetSubmissionIssueType, {
  as: 'type',
  foreignKey: 'id',
  sourceKey: 'issueTypeId',
});

AssetSubmissionIssue.hasOne(Role, {
  as: 'authorRole',
  foreignKey: 'id',
  sourceKey: 'authorRoleId',
});

AssetSubmissionIssue.hasOne(User, {
  as: 'author',
  foreignKey: 'id',
  sourceKey: 'authorUserId',
});
