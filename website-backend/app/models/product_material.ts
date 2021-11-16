// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProductMaterialAttributes, ProductMaterialCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface ProductMaterialInstance
  extends Model<ProductMaterialAttributes, ProductMaterialCreationAttributes>,
  ProductMaterialAttributes {}

type ProductMaterialModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductMaterialInstance;
};

export const ProductMaterial = sql.define('product_material', {
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  materialId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  slotName: {
    type: Sequelize.STRING,
    allowNull: true,
  },
}) as ProductMaterialModelStatic;

export default ProductMaterial;
