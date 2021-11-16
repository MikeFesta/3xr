// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { PaymentAttributes, PaymentCreationAttributes } from '@types';
import { User } from '@models/user';
import { sql } from '@root/sql';

interface PaymentInstance extends Model<PaymentAttributes, PaymentCreationAttributes>, PaymentAttributes {}

type PaymentModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): PaymentInstance;
};

export const Payment = sql.define('payment', {
  uid: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  admin_user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  artistUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  paypal_email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  paypal_transaction_id: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  transaction_amount: {
    type: Sequelize.FLOAT,
    allowNull: false,
  },
  transaction_date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW,
    get: function (this: any) {
      return moment.utc(this.getDataValue('date_due')).format('dddd, MMMM Do YYYY');
    },
  },
}) as PaymentModelStatic;

export default Payment;

// Required files that would have a circular dependency
// import {Asset } from '@models/asset';

// Joins
Payment.hasOne(User, {
  as: 'admin',
  foreignKey: 'id',
  sourceKey: 'admin_user_id',
});

Payment.hasOne(User, {
  as: 'artist',
  foreignKey: 'id',
  sourceKey: 'artistUserId',
});
