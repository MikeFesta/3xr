// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetIssueCategoryTypeAttributes, AssetIssueCategoryTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetIssueCategoryTypeInstance
  extends Model<AssetIssueCategoryTypeAttributes, AssetIssueCategoryTypeCreationAttributes>,
  AssetIssueCategoryTypeAttributes {}

type AssetIssueCategoryTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetIssueCategoryTypeInstance;
};

export const AssetIssueCategoryType = sql.define('asset_issue_category_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  sort_weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as AssetIssueCategoryTypeModelStatic;

export default AssetIssueCategoryType;
