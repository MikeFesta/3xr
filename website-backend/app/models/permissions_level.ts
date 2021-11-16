// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { PermissionsLevelAttributes, PermissionsLevelCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface PermissionsLevelInstance
  extends Model<PermissionsLevelAttributes, PermissionsLevelCreationAttributes>,
  PermissionsLevelAttributes {}

type PermissionsLevelModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): PermissionsLevelInstance;
};

export const PermissionsLevel = sql.define('permissions_level', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as PermissionsLevelModelStatic;

export default PermissionsLevel;
