// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProductCombinationCreationAttributes, ProductCombinationAttributes } from '@types';
import { sql } from '@root/sql';

export interface ProductCombinationInstance
  extends Model<ProductCombinationAttributes, ProductCombinationCreationAttributes>,
  ProductCombinationAttributes {}

type ProductCombinationModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductCombinationInstance;
};

export const ProductCombination = sql.define('product_combination', {
  productId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  assetId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
}) as ProductCombinationModelStatic;

export default ProductCombination;

import { Asset } from '@models/asset';
import { Product } from '@models/product';

ProductCombination.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});

ProductCombination.hasOne(Product, {
  as: 'product',
  foreignKey: 'id',
  sourceKey: 'productId',
});
