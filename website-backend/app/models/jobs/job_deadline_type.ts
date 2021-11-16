// SPDX-License-Identifier: Apache-2.0
import { sql } from '@root/sql';
import { BuildOptions, Model, STRING } from 'sequelize';
import { JobDeadlineTypeAttributes, JobDeadlineTypeCreationAttributes } from '@types';

interface JobDeadlineTypeInstance
  extends Model<JobDeadlineTypeAttributes, JobDeadlineTypeCreationAttributes>,
  JobDeadlineTypeAttributes {}

type JobDeadlineTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobDeadlineTypeInstance;
};

export const JobDeadlineType = sql.define(
  'job_deadline_type',
  {
    name: {
      type: STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['id', 'name'],
      },
    },
  },
) as JobDeadlineTypeModelStatic;

export default JobDeadlineType;
