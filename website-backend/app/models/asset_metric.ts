// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetMetricAttributes, AssetMetricCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetMetricInstance
  extends Model<AssetMetricAttributes, AssetMetricCreationAttributes>,
  AssetMetricAttributes {}

type AssetMetricModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetMetricInstance;
};

export const AssetMetric = sql.define(
  'asset_metric',
  {
    abId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    assetUid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    cameraEngagement: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    customerUid: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    deviceTypeId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    ipAddress: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    metricTypeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    notes: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    sessionTimeMs: {
      type: Sequelize.INTEGER, // miliseconds, up to 24 days
      allowNull: true,
    },
    sessionUid: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    source: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    url: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    userAgent: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    viewerSessionUid: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any): string {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('h:mm:ssa MM/DD/YYYY');
      },
    },
  },
) as AssetMetricModelStatic;

export default AssetMetric;

import { Asset } from '@models/asset';

AssetMetric.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'uid',
  sourceKey: 'assetUid',
});
