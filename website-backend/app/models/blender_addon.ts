// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions } from 'sequelize';
import { BlenderAddonAttributes, BlenderAddonCreationAttributes } from '@types';
import { sql } from '@root/sql';
import { Model } from 'sequelize';

interface BlenderAddonInstance
  extends Model<BlenderAddonAttributes, BlenderAddonCreationAttributes>,
  BlenderAddonAttributes {}

type BlenderAddonModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): BlenderAddonInstance;
  findLatestVersion(): Promise<Sequelize.Model<BlenderAddonAttributes, BlenderAddonCreationAttributes> | null>;
};

export const BlenderAddon = sql.define('blender_addon', {
  version: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  blenderVersion: {
    type: Sequelize.STRING,
    allowNull: false,
    defaultValue: '2.81',
  },
}) as BlenderAddonModelStatic;

export default BlenderAddon;

BlenderAddon.findLatestVersion = () => {
  return BlenderAddon.findOne({
    order: [['id', 'DESC']],
  });
};
