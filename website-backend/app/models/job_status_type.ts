// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobStatusTypeAttributes, JobStatusTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface JobStatusTypeInstance
  extends Model<JobStatusTypeAttributes, JobStatusTypeCreationAttributes>,
  JobStatusTypeAttributes {}

type JobStatusTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobStatusTypeInstance;
};

export const JobStatusType = sql.define(
  'job_status_type',
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
) as JobStatusTypeModelStatic;

export default JobStatusType;
