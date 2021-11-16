// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { IconAttributes, IconCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface IconInstance extends Model<IconAttributes, IconCreationAttributes>, IconAttributes {}

type IconModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): IconInstance;
};

export const Icon = sql.define('icon', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  noun_project_id: {
    type: Sequelize.INTEGER,
    allowNull: true,
    unique: true,
  },
}) as IconModelStatic;

export default Icon;
