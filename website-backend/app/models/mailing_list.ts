// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { MailingListAttributes, MailingListCreationAttributes } from '@types';
import { sql } from '@root/sql';
import Errors from '@root/errors';

interface MailingListInstance
  extends Model<MailingListAttributes, MailingListCreationAttributes>,
  MailingListAttributes {}

type MailingListModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): MailingListInstance;
  getActiveSubscribers(): Promise<{ subscribers: MailingListInstance[] }>;
};

export const MailingList = sql.define(
  'mailing_list',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    interest: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    ip: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    comanpy: {
      type: Sequelize.STRING,
      allowNull: true,
      unique: false,
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: true,
      unique: false,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any) {
        return moment.utc(this.getDataValue('createdAt')).format('MM/DD/YYYY_hh:mm A z');
      },
    },
  },
) as MailingListModelStatic;

export default MailingList;

MailingList.getActiveSubscribers = () => {
  return new Promise((resolve, reject) => {
    MailingList.findAll({ order: [['createdAt', 'DESC']] })
      .then(results => {
        resolve({ subscribers: results });
      })
      .catch((err: Error) => {
        Errors.reject(reject, err, 'Error getting mailing list subscribers');
      });
  });
};
