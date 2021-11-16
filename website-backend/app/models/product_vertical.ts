// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProductVerticalAttributes, ProductVerticalCreationAttributes } from '@types';
import { sql } from '@root/sql';

// Replaced by ClientClass so each client can have their own

interface ProductVerticalInstance
  extends Model<ProductVerticalAttributes, ProductVerticalCreationAttributes>,
  ProductVerticalAttributes {}

type ProductVerticalModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductVerticalInstance;
};

export const ProductVertical = sql.define('product_vertical', {
  uid: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as ProductVerticalModelStatic;

export default ProductVertical;
