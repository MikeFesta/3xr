// SPDX-License-Identifier: Apache-2.0
import { INTEGER, STRING, TEXT, Model, BuildOptions } from 'sequelize';
import { EmailLogAttributes, EmailLogCreationAttributes } from '@types';
import { sql } from '../sql';

interface EmailLogInstance extends Model<EmailLogAttributes, EmailLogCreationAttributes>, EmailLogAttributes {}

type EmailLogModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): EmailLogInstance;
};

const EmailLog = sql.define(
  'EmailLog',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER,
    },
    emailTo: {
      type: STRING,
      allowNull: false,
    },
    subject: {
      type: STRING,
      allowNull: false,
    },
    html: {
      type: TEXT,
      allowNull: false,
    },
  },
  {
    underscored: true,
    tableName: 'email_logs',
  },
) as EmailLogModelStatic;

export default EmailLog;
