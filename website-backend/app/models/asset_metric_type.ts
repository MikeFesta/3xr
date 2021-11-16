// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetMetricTypeAttributes, AssetMetricTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetMetricTypeInstance
  extends Model<AssetMetricTypeAttributes, AssetMetricTypeCreationAttributes>,
  AssetMetricTypeAttributes {}

type AssetMetricTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetMetricTypeInstance;
};

export const AssetMetricType = sql.define('asset_metric_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as AssetMetricTypeModelStatic;

export default AssetMetricType;
