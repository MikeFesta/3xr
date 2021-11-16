// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetSubmissionIssueTypeCreationAttributes, AssetSubmissionIssueTypeAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetSubmissionIssueTypeInstance
  extends Model<AssetSubmissionIssueTypeAttributes, AssetSubmissionIssueTypeCreationAttributes>,
  AssetSubmissionIssueTypeAttributes {}

type AssetSubmissionIssueTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionIssueTypeInstance;
};

export const AssetSubmissionIssueType = sql.define('asset_submission_issue_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  categoryId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sortWeight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as AssetSubmissionIssueTypeModelStatic;

export default AssetSubmissionIssueType;

// Additional Includes
import { AssetSubmissionIssueCategoryType } from '@models/asset_submission_issue_category_type';

// Additional Scopes
AssetSubmissionIssueType.addScope('details', {
  attributes: ['id', 'name', 'sortWeight'],
  include: [{ as: 'category', model: AssetSubmissionIssueCategoryType }],
});

AssetSubmissionIssueType.hasOne(AssetSubmissionIssueCategoryType, {
  as: 'category',
  foreignKey: 'id',
  sourceKey: 'categoryId',
});
