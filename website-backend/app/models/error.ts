// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { ErrorAttributes, ErrorCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface ErrorInstance extends Model<ErrorAttributes, ErrorCreationAttributes>, ErrorAttributes {}

type ErrorModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ErrorInstance;
};

export const Error = sql.define(
  'error',
  {
    hash: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    message: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {},
) as ErrorModelStatic;

export default Error;
