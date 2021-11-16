// SPDX-License-Identifier: Apache-2.0
import * as moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { IPLogAttributes, IPLogCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface IPLogInstance extends Model<IPLogAttributes, IPLogCreationAttributes>, IPLogAttributes {}

type IPLogModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): IPLogInstance;
  log(ip: string): Promise<void>;
  logUser(ip: string, user_id: number): Promise<void>;
};

export const IPLog = sql.define(
  'ip_log',
  {
    ip: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: true,
      unique: false,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any) {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('h:mm:ssa MM/DD/YYYY');
      },
    },
  },
) as IPLogModelStatic;

export default IPLog;

import { User } from '@models/user';

IPLog.log = (ip: string) => {
  return new Promise((resolve, reject) => {
    IPLog.create({ ip: ip })
      .then(result => {
        resolve();
      })
      .catch((err: Error) => {
        reject();
      });
  });
};

IPLog.logUser = (ip: string, user_id: number) => {
  return new Promise((resolve, reject) => {
    IPLog.create({ ip: ip, user_id: user_id })
      .then(result => {
        resolve();
      })
      .catch((err: Error) => {
        reject();
      });
  });
};

IPLog.hasOne(User, {
  as: 'user',
  foreignKey: 'id',
  sourceKey: 'user_id',
});
