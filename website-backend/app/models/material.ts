// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { MaterialAttributes, MaterialCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface MaterialInstance extends Model<MaterialAttributes, MaterialCreationAttributes>, MaterialAttributes {}

type MaterialModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): MaterialInstance;
};

export const Material = sql.define('material', {
  blendMode: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  blendName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  diffuseRedValue: Sequelize.INTEGER,
  diffuseGreenValue: Sequelize.INTEGER,
  diffuseBlueValue: Sequelize.INTEGER,
  mappingScaleValue: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
  metallicValue: Sequelize.INTEGER,
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  normalStrengthValue: {
    type: Sequelize.FLOAT,
    allowNull: false,
    defaultValue: 1,
  },
  roughnessValue: Sequelize.FLOAT,
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
}) as MaterialModelStatic;

export default Material;

// Additional Includes
import { Product } from '@models/product';
import { ProductMaterial } from '@models/product_material';

// Joins
Material.belongsToMany(Product, { through: ProductMaterial });

Material.addScope('withProducts', {
  include: [
    {
      as: 'products',
      model: Product.scope('minimum'),
    },
  ],
});
