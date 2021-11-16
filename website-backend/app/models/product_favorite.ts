// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProductFavoriteAttributes, ProductFavoriteCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface ProductFavoriteInstance
  extends Model<ProductFavoriteAttributes, ProductFavoriteCreationAttributes>,
  ProductFavoriteAttributes {}

type ProductFavoriteModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductFavoriteInstance;
};

export const ProductFavorite = sql.define('product_favorite', {
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as ProductFavoriteModelStatic;

export default ProductFavorite;
