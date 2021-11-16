// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { PartAttributes, PartCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface PartInstance extends Model<PartAttributes, PartCreationAttributes>, PartAttributes {}

type PartModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): PartInstance;
};

export const Part = sql.define('part', {
  blendName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  createdFromSubmissionId: {
    type: Sequelize.INTEGER,
    allowNull: true
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
}) as PartModelStatic;

export default Part;

// Additional Includes
import { Product } from '@models/product';
import { ProductPart } from '@models/product_part';
import { PartSlot } from '@models/part_slot';

// Joins
Part.belongsToMany(Product, { through: ProductPart });
Part.hasMany(PartSlot, {
  as: 'slots',
  foreignKey: 'partId',
  sourceKey: 'id'
});

// Scopes
Part.addScope('forProduct', (id: string) => ({
  include: [
    {
      as: 'products',
      model: Product,
      where: { id: id }
    },
  ],
}));
Part.addScope('withProducts', {
  include: [
    {
      as: 'products',
      model: Product.scope('minimum'),
    },
  ],
});
Part.addScope('withSlots', {
  include: [
    {
      as: 'slots',
      model: PartSlot,
    },
  ],
});
