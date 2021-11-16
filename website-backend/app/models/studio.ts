// SPDX-License-Identifier: Apache-2.0
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { StudioAttributes, StudioCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface StudioInstance extends Model<StudioAttributes, StudioCreationAttributes>, StudioAttributes {}

type StudioModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): StudioInstance;
};

export const Studio = sql.define(
  'studio',
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
    getterMethods: {},
    scopes: {
      basic: {
        attributes: ['id', 'name', 'uid'],
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
) as StudioModelStatic;

export default Studio;

// Additional Includes
import { Client } from '@models/client';
import { ClientStudio } from '@models/client_studio';
import { User } from '@models/user';
import { UserStudio } from '@models/user_studio';

// Joins
Studio.belongsToMany(Client, { as: 'clients', through: ClientStudio });
Studio.belongsToMany(User, { as: 'users', through: UserStudio });

// Scopes with includes
Studio.addScope(
  'idsForUser',
  (userId: number) =>
  ({
    attributes: ['id'],
    where: { userId: userId }
  } as any)
);

Studio.addScope('adminSearch', {
  include: [
    {
      as: 'users',
      model: User.scope('basic'),
    },
  ],
  order: [['name', 'ASC']]
} as any);

Studio.addScope(
  'forClient',
  (clientId: number) =>
  ({
    include: [
      {
        as: 'clients',
        attributes: [],
        model: Client.scope('basic'),
        where: { id: clientId },
      }
    ],
  } as any),
);

Studio.addScope(
  'forUser',
  (userId: number) =>
  ({
    include: [
      {
        as: 'users',
        attributes: [],
        model: User.scope('basic'),
        where: { id: userId },
      }
    ],
  } as any),
);
