// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProductPartAttributes, ProductPartCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface ProductPartInstance
  extends Model<ProductPartAttributes, ProductPartCreationAttributes>,
  ProductPartAttributes {}

type ProductPartModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductPartInstance;
};

export const ProductPart = sql.define('product_part', {
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  partId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as ProductPartModelStatic;

export default ProductPart;
