// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetFileAttributes, AssetFileCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetFileInstance extends Model<AssetFileAttributes, AssetFileCreationAttributes>, AssetFileAttributes {}

type AssetFileModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetFileInstance;
};

export const AssetFile = sql.define(
  'asset_file',
  {
    assetId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    // Used to group like files together (ie 360 spins)
    collection: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    hash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    order: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    // TODO: Add Resolution
    size: {
      // Note: max size for INTEGER is 2GB, which should be fine
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    typeId: {
      type: Sequelize.INTEGER,
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
    scopes: {
      nameSizeType: {
        attributes: ['filename', 'id', 'size', 'typeId'],
      },
    },
  },
) as AssetFileModelStatic;

export default AssetFile;

// Additional Includes

import { Asset } from '@models/asset';
import { FileType } from '@models/file_type';

AssetFile.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});

AssetFile.hasOne(FileType, {
  as: 'type',
  foreignKey: 'id',
  sourceKey: 'typeId',
});
