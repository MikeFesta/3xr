// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetTextureAttributes, AssetTextureCreationAttributes } from '@types';
import { sql } from '@root/sql';

export interface AssetTextureInstance
  extends Model<AssetTextureAttributes, AssetTextureCreationAttributes>,
  AssetTextureAttributes {}

type AssetTextureModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetTextureInstance;
};

export const AssetTexture = sql.define('asset_texture', {
  assetId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  color: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  filename: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fileExtensionTypeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  textureTypeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as AssetTextureModelStatic;

export default AssetTexture;

// Additional Includes
import { Asset } from '@models/asset';
import { FileExtensionType } from '@models/file_extension_type';
import { TextureType } from '@models/texture_type';

AssetTexture.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});

AssetTexture.hasOne(FileExtensionType, {
  as: 'extension',
  foreignKey: 'id',
  sourceKey: 'fileExtensionTypeId',
});

AssetTexture.hasOne(TextureType, {
  as: 'type',
  foreignKey: 'id',
  sourceKey: 'textureTypeId',
});
