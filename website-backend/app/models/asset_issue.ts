// SPDX-License-Identifier: Apache-2.0
import * as moment from 'moment';
import Sequelize, { ModelDefined } from 'sequelize';
import { AssetIssueI, AssetIssueCreateI } from '@types';
import { Asset } from '@models/asset';
import { AssetIssueType } from '@models/asset_issue_type';
import { User } from '@models/user';
import { sql } from '@root/sql';

/**
 * DEPRICATED (?) - this might have been a part of assignments and was replaced with asset_submission_issue.
 *
 * @deprecated No longer used.
 */
export const AssetIssue: ModelDefined<AssetIssueI, AssetIssueCreateI> = sql.define(
  'asset_issue',
  {
    asset_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    author_user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    issue_type_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    additional_details: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    screenshot: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    resolved: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('MM/DD/YYYY hh:mm:ssa z');
      },
      updatedAt: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('updatedAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('MM/DD/YYYY hh:mm:ssa z');
      },
    },
  },
);

export default AssetIssue;

AssetIssue.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'asset_id',
});

AssetIssue.hasOne(AssetIssueType, {
  as: 'issue_type',
  foreignKey: 'id',
  sourceKey: 'issue_type_id',
});

AssetIssue.hasOne(User, {
  as: 'author',
  foreignKey: 'id',
  sourceKey: 'author_user_id',
});
