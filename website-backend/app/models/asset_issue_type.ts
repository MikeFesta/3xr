// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetIssueTypeAttributes, AssetIssueTypeCreationAttributes } from '@types';
import { AssetIssueCategoryType } from '@models/asset_issue_category_type';
import { sql } from '@root/sql';

interface AssetIssueTypeInstance
  extends Model<AssetIssueTypeAttributes, AssetIssueTypeCreationAttributes>,
  AssetIssueTypeAttributes {}

type AssetIssueTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetIssueTypeInstance;
};

export const AssetIssueType = sql.define('asset_issue_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sort_weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as AssetIssueTypeModelStatic;

AssetIssueType.hasOne(AssetIssueCategoryType, {
  as: 'category',
  foreignKey: 'id',
  sourceKey: 'category_id',
});

export default AssetIssueType;
