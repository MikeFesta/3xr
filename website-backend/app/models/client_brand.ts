// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions } from 'sequelize';
import { ClientBrandAttributes, ClientBrandCreationAttributes } from '@types';
import { Client } from '@models/client';
import { sql } from '@root/sql';
import { Model } from 'sequelize';

interface ClientBrandInstance
  extends Model<ClientBrandAttributes, ClientBrandCreationAttributes>,
  ClientBrandAttributes {}

type ClientBrandModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ClientBrandInstance;
};

export const ClientBrand = sql.define(
  'client_brand',
  {
    clientId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deleted: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['clientId', 'name'],
      },
    ],
    scopes: {
      basic: {
        attributes: ['id', 'name'],
      },
      picklist: {
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
      },
    },
  },
) as ClientBrandModelStatic;

export default ClientBrand;

ClientBrand.hasOne(Client, {
  as: 'client',
  foreignKey: 'id',
  sourceKey: 'clientId',
});
