// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, ModelDefined } from 'sequelize';
import { AssetTagAttributes, AssetTagCreationAttributes } from '@types';
import { sql } from '@root/sql';
import { Model } from 'sequelize';

interface AssetTagInstance extends Model<AssetTagAttributes, AssetTagCreationAttributes>, AssetTagAttributes {}

type AssetTagModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetTagInstance;
};

export const AssetTag = sql.define('asset_tag', {
  asset_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  tag_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sort_weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as AssetTagModelStatic;

export default AssetTag;
