// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProductHoldingAttributes, ProductHoldingCreationAttributes } from '@types';
import { UnitTypeEnum } from '@enums';
import { Client } from '@models/client';
import { ProductHoldingReferenceImage } from '@models/product_holding_reference_image';
import { UnitType } from '@models/unit_type';
import { sql } from '@root/sql';

export interface ProductHoldingInstance
  extends Model<ProductHoldingAttributes, ProductHoldingCreationAttributes>,
  ProductHoldingAttributes {}

type ProductHoldingModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductHoldingInstance;
  findByClientIds(clientIds: number[]): Promise<ProductHoldingInstance[]>;
};

export const ProductHolding = sql.define(
  'product_holding',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    bcProductId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    clientId: {
      type: Sequelize.INTEGER,
      primaryKey: false,
      allowNull: false,
    },
    projectHoldingId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    productHoldingType: {
      type: Sequelize.INTEGER,
      primaryKey: false,
      allowNull: false,
    },
    depth: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    height: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    partNumber: {
      type: Sequelize.STRING,
    },
    sku: {
      type: Sequelize.STRING,
    },
    unitTypeId: {
      type: Sequelize.INTEGER,
      defaultValue: UnitTypeEnum.METERS,
    },
    width: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    deleted: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  {
    tableName: 'product_holdings',
    underscored: true,
    timestamps: true,
    defaultScope: {
      where: {
        deleted: false,
      },
    },
    scopes: {},
  },
) as ProductHoldingModelStatic;

export default ProductHolding;

ProductHolding.hasMany(ProductHoldingReferenceImage, {
  as: 'referenceImages',
  foreignKey: 'productHoldingId',
  sourceKey: 'id',
});

ProductHolding.hasOne(UnitType, {
  as: 'units',
  foreignKey: 'id',
  sourceKey: 'unitTypeId',
});

ProductHolding.hasOne(Client, {
  as: 'client',
  foreignKey: 'id',
  sourceKey: 'clientId',
});

ProductHolding.addScope('importingUX', {
  attributes: ['id', 'bcProductId', 'name', 'depth', 'height', 'width'],
  include: [
    {
      as: 'referenceImages',
      model: ProductHoldingReferenceImage,
      required: false,
    },
  ],
});

ProductHolding.findByClientIds = async (clientIds: number[]) => {
  return ProductHolding.scope('importingUX').findAll({
    where: {
      clientId: clientIds,
    },
  });
};
