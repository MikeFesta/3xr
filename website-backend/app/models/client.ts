// SPDX-License-Identifier: Apache-2.0
import { utc, tz } from 'moment';
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { ClientAttributes, ClientCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface ClientInstance extends Model<ClientAttributes, ClientCreationAttributes>, ClientAttributes {}

type ClientModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ClientInstance;
};

export const Client = sql.define(
  'client',
  {
    uid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    getterMethods: {
      /* Moved formatting to front-end
      createdAt: function (this: any) {
        const utc_date = utc(this.getDataValue('createdAt')).toDate();
        return tz(utc_date, 'America/New_York').format('MM/DD/YYYY hh:mm:ssa z');
      },
      */
      date_created: function (this: any) {
        const utc_date = utc(this.getDataValue('createdAt')).toDate();
        return tz(utc_date, 'America/New_York').format('MM/DD/YYYY');
      },
    },
    scopes: {
      // Note: getters are still included
      basic: {
        attributes: ['id', 'name', 'uid'],
      },
      forNotifications: {
        attributes: ['id', 'name'],
      },
      picklist: {
        attributes: ['id', 'name'],
        order: [['name', 'ASC']],
      },
      uid: {
        attributes: ['uid'],
      },
    },
  },
) as ClientModelStatic;

export default Client;

// Additional Includes
import { ClientBrand } from '@models/client_brand';
import { ClientClass } from '@models/client_class';
import { User } from '@models/user';
import { UserClient } from '@models/user_client';

// Joins
Client.hasMany(ClientBrand, {
  as: 'brands',
  foreignKey: 'clientId',
  sourceKey: 'id',
});

Client.hasMany(ClientClass, {
  as: 'classes',
  foreignKey: 'clientId',
  sourceKey: 'id',
});

Client.belongsToMany(User, { as: 'users', through: UserClient });

// Scopes with includes
Client.addScope('details', {
  attributes: ['id', 'name', 'uid'],
  include: [
    {
      as: 'brands',
      model: ClientBrand,
      order: [['name']],
      required: false,
      where: { deleted: false },
    },
    {
      as: 'classes',
      model: ClientClass,
      order: [['name']],
      required: false,
      where: { deleted: false },
    },
  ],
} as any);

Client.addScope(
  'idsForUser',
  (userId: number) =>
  ({
    attributes: ['id'],
    where: { userId: userId }
  } as any)
);

Client.addScope(
  'forUser',
  (userId: number) =>
  ({
    include: [
      {
        as: 'users',
        model: User.scope('basic'),
        where: { id: userId },
      },
      {
        as: 'brands',
        model: ClientBrand.scope('basic'),
        order: [['name']],
        required: false,
        where: { deleted: false },
      },
      {
        as: 'classes',
        model: ClientClass.scope('basic'),
        order: [['name']],
        required: false,
        where: { deleted: false },
      },
    ],
  } as any),
);

Client.addScope('adminSearch', {
  include: [
    {
      as: 'users',
      model: User.scope('basic'),
    },
    {
      as: 'brands',
      model: ClientBrand.scope('basic'),
      order: [['name']],
      required: false,
      where: { deleted: false },
    },
    {
      as: 'classes',
      model: ClientClass.scope('basic'),
      order: [['name']],
      required: false,
      where: { deleted: false },
    },
  ],
  order: [['name', 'ASC']]
} as any);
