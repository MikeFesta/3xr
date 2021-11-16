// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import {
  ProductHoldingReferenceImageCreationAttributes,
  ProductHoldingReferenceImageAttributes,
} from '@root/interfaces/ProductHoldingReferenceImageI';
import { sql } from '@root/sql';

export interface ProductImportReferenceImageInstance
  extends Model<ProductHoldingReferenceImageAttributes, ProductHoldingReferenceImageCreationAttributes>,
  ProductHoldingReferenceImageAttributes {
}

type ProductHoldingReferenceImageModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductImportReferenceImageInstance;
};

export const ProductHoldingReferenceImage = sql.define(
  'product_holding_reference_image',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    bcProductId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    bcProductReferenceImageId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    productHoldingId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imageLargeUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    imageSmallUrl: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    sortWeight: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: 'product_holding_reference_images',
    underscored: true,
    timestamps: true,
    scopes: {
      primary: {
        where: { sort_weight: 1, deleted: false },
      },
    },
  },
) as ProductHoldingReferenceImageModelStatic;

export default ProductHoldingReferenceImage;

ProductHoldingReferenceImage.addScope('importingUX', {
  attributes: [
    'id',
    'bcProductId',
    'bcProductReferenceImageId',
    'filename',
    'imageLargeUrl',
    'imageSmallUrl',
    'productHoldingId'],
});
