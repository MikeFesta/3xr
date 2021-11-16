// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { PartSlotAttributes, PartSlotCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface PartSlotInstance extends Model<PartSlotAttributes, PartSlotCreationAttributes>, PartSlotAttributes {}

type PartSlotModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): PartSlotInstance;
};

export const PartSlot = sql.define('part_slot', {
  partId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  slotName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as PartSlotModelStatic;

export default PartSlot;

// Additional Includes
import { Part } from '@models/part';

// Joins
PartSlot.belongsTo(Part);
