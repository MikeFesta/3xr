// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { UnitTypeAttributes, UnitTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

export interface UnitTypeInstance extends Model<UnitTypeAttributes, UnitTypeCreationAttributes>, UnitTypeAttributes {}

type UnitTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UnitTypeInstance;
};

export const UnitType = sql.define(
  'unit_type',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['id', 'name'],
      },
      picklist: {
        attributes: ['id', 'name'],
      },
    },
  },
) as UnitTypeModelStatic;

export default UnitType;
