// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProductHoldingTypeAttributes, ProductHoldingTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface ProductHoldingTypeInstance
  extends Model<ProductHoldingTypeAttributes, ProductHoldingTypeCreationAttributes>,
  ProductHoldingTypeAttributes {}

type ProductHoldingTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductHoldingTypeInstance;
};

export const ProductHoldingType = sql.define(
  'product_holding_type',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    tableName: 'product_holding_types',
    underscored: true,
    timestamps: false,
    scopes: {
      basic: {
        attributes: ['id', 'name'],
      },
    },
  },
) as ProductHoldingTypeModelStatic;

export default ProductHoldingType;
