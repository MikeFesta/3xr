// SPDX-License-Identifier: Apache-2.0
import * as moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetUploadLogAttributes, AssetUploadLogCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetUploadLogInstance
  extends Model<AssetUploadLogAttributes, AssetUploadLogCreationAttributes>,
  AssetUploadLogAttributes {}

type AssetUploadLogModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetUploadLogInstance;
};

export const AssetUploadLog = sql.define(
  'asset_upload_log',
  {
    asset_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      unique: false,
    },
    modeling_hours: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
    texturing_hours: {
      type: Sequelize.FLOAT,
      allowNull: true,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any) {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('h:mm:ssa MM/DD/YYYY');
      },
    },
  },
) as AssetUploadLogModelStatic;

export default AssetUploadLog;

import { Asset } from '@models/asset';

Asset.hasMany(AssetUploadLog);

AssetUploadLog.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'asset_id',
});
