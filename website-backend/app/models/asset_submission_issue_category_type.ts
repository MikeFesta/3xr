// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetSubmissionIssueCategoryTypeCreationAttributes, AssetSubmissionIssueCategoryTypeAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetSubmissionIssueCategoryTypeInstance
  extends Model<AssetSubmissionIssueCategoryTypeAttributes, AssetSubmissionIssueCategoryTypeCreationAttributes>,
  AssetSubmissionIssueCategoryTypeAttributes {}

type AssetSubmissionIssueCategoryTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionIssueCategoryTypeInstance;
};

export const AssetSubmissionIssueCategoryType = sql.define(
  'asset_submission_issue_category_type',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    label: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sortWeight: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['id', 'name', 'label', 'sortWeight'],
      },
    },
  },
) as AssetSubmissionIssueCategoryTypeModelStatic;

export default AssetSubmissionIssueCategoryType;

// Additional Includes
import { AssetSubmissionIssueType } from '@models/asset_submission_issue_type';

// Scopes with includes
AssetSubmissionIssueCategoryType.addScope('categoriesAndIssues', {
  attributes: ['id', 'name', 'label'],
  include: [
    {
      as: 'types',
      attributes: ['id', 'name', 'sortWeight'],
      model: AssetSubmissionIssueType,
    },
  ],
  order: [['sortWeight', 'ASC']],
});

AssetSubmissionIssueCategoryType.hasMany(AssetSubmissionIssueType, {
  as: 'types',
  foreignKey: 'categoryId',
  sourceKey: 'id',
});
