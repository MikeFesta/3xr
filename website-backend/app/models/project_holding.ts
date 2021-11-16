// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ProjectHoldingAttributes, ProjectHoldingCreationAttributes } from '@types';
import { ProductHolding } from '@models/product_holding';
import { Client } from '@models/client';
import { UnitType } from '@models/unit_type';
import { sql } from '@root/sql';

export interface ProjectHoldingInstance
  extends Model<ProjectHoldingAttributes, ProjectHoldingCreationAttributes>,
  ProjectHoldingAttributes {}

type ProjectHoldingModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProjectHoldingInstance;
  findByClientIds(clientIds: number[]): Promise<ProjectHoldingInstance[]>;
};

export const ProjectHolding = sql.define(
  'project_holding',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    clientId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    defaultUnitType: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deleted: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  {
    tableName: 'project_holdings',
    underscored: true,
    timestamps: true,
    defaultScope: {
      where: {
        deleted: false,
      },
    },
    scopes: {},
  },
) as ProjectHoldingModelStatic;

export default ProjectHolding;

ProjectHolding.hasMany(ProductHolding, {
  as: 'productHoldings',
  foreignKey: 'projectHoldingId',
  sourceKey: 'id',
});

ProjectHolding.hasOne(Client, {
  as: 'client',
  foreignKey: 'id',
  sourceKey: 'clientId',
});

ProjectHolding.hasOne(UnitType, {
  as: 'units',
  foreignKey: 'id',
  sourceKey: 'defaultUnitType',
});

ProjectHolding.addScope('projectPOImportUX', {
  attributes: ['id', 'clientId', 'name', 'defaultUnitType'],
  include: [
    {
      as: 'productHoldings',
      model: ProductHolding.scope('importingUX'),
      required: false,
    },
  ],
});

ProjectHolding.findByClientIds = async (clientIds: number[]) => {
  return ProjectHolding.scope('projectPOImportUX').findAll({
    where: {
      clientId: clientIds,
      deleted: false,
    },
  });
};
