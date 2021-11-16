// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetRenderAttributes, AssetRenderCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetRenderInstance
  extends Model<AssetRenderAttributes, AssetRenderCreationAttributes>,
  AssetRenderAttributes {}

type AssetRenderModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetRenderInstance;
};

export const AssetRender = sql.define(
  'asset_render',
  {
    assetId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['assetId', 'filename'],
      },
    ],
  },
) as AssetRenderModelStatic;

export default AssetRender;

import { Asset } from '@models/asset';

AssetRender.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});
