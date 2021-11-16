// SPDX-License-Identifier: Apache-2.0
import sequelize = require('sequelize');
import { AssetSpinSetAttributes, AssetSpinSetCreationAttributes } from '@types';
import { BuildOptions, Model, ModelDefined } from 'sequelize';
import { sql } from '@root/sql';

interface AssetSpinSetInstance
  extends Model<AssetSpinSetAttributes, AssetSpinSetCreationAttributes>,
  AssetSpinSetAttributes {}

type AssetSpinSetModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSpinSetInstance;
};

export const AssetSpinSet = sql.define(
  'asset_spin_set',
  {
    angle: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    assetId: {
      type: sequelize.INTEGER,
      allowNull: false,
    },
    imageCount: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    resolution: {
      type: sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['assetId', 'angle', 'resolution', 'imageCount'], // TODO: update migrations
      },
    ],
  },
) as AssetSpinSetModelStatic;

export default AssetSpinSet;

import { Asset } from '@models/asset';

AssetSpinSet.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});
