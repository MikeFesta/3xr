// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobPriorityTypeAttributes, JobPriorityTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface JobPriorityTypeInstance
  extends Model<JobPriorityTypeAttributes, JobPriorityTypeCreationAttributes>,
  JobPriorityTypeAttributes {}

type JobPriorityTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobPriorityTypeInstance;
};

export const JobPriorityType = sql.define(
  'job_priority_type',
  {
    name: {
      type: Sequelize.STRING,
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
) as JobPriorityTypeModelStatic;

export default JobPriorityType;
