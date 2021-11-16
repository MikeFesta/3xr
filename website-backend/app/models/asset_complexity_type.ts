// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetComplexityTypeAttributes, AssetComplexityTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetComplexityTypeInstance
  extends Model<AssetComplexityTypeAttributes, AssetComplexityTypeCreationAttributes>,
  AssetComplexityTypeAttributes {}

type AssetComplexityTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetComplexityTypeInstance;
};

export const AssetComplexityType = sql.define(
  'asset_complexity_type',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      picklist: {
        attributes: ['id', 'name'],
      },
    },
  },
) as AssetComplexityTypeModelStatic;

export default AssetComplexityType;
