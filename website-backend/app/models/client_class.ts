// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ClientClassAttributes, ClientClassCreationAttributes } from '@types';
import { Client } from '@models/client';
import { sql } from '@root/sql';

interface ClientClassInstance
  extends Model<ClientClassAttributes, ClientClassCreationAttributes>,
  ClientClassAttributes {}

type ClientClassModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ClientClassInstance;
};

export const ClientClass = sql.define(
  'client_class',
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
) as ClientClassModelStatic;

export default ClientClass;

ClientClass.prototype.getFrontendData = function () {
  return {
    name: this.name,
  };
};

ClientClass.hasOne(Client, {
  as: 'client',
  foreignKey: 'id',
  sourceKey: 'clientId',
});
