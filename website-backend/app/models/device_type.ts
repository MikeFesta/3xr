// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { DeviceTypeAttributes, DeviceTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface DeviceTypeInstance extends Model<DeviceTypeAttributes, DeviceTypeCreationAttributes>, DeviceTypeAttributes {}

type DeviceTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): DeviceTypeInstance;
};

export const DeviceType = sql.define('device_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as DeviceTypeModelStatic;

export default DeviceType;
