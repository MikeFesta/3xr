// SPDX-License-Identifier: Apache-2.0
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { AssetAbAlternativeAttributes, AssetAbAlternativeCreationAttributes } from '@types';
import { sql } from '@root/sql';

export interface AssetAbAlternativeInstance
  extends Model<AssetAbAlternativeAttributes, AssetAbAlternativeCreationAttributes>,
  AssetAbAlternativeAttributes {}

type AssetAbAlternativeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetAbAlternativeInstance;
};

export const AssetAbAlternative = sql.define('asset_ab_alternative', {
  assetId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  bannerButtonText: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cameraOrbit: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cameraTarget: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  exposure: {
    type: Sequelize.FLOAT,
    defaultValue: 0.8,
    allowNull: true,
  },
  hdr: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  probabilityWeight: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
  productName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  productPrice: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  productSubtitle: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  productUrl: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  shadowIntensity: {
    type: Sequelize.FLOAT,
    defaultValue: 0.8,
    allowNull: true,
  },
  showBanner: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  showOptions: {
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
}) as AssetAbAlternativeModelStatic;

export default AssetAbAlternative;

// Additional Includes
import { Asset } from '@models/asset';

// Joins
AssetAbAlternative.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});
