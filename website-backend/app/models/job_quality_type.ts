// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobQualityTypeAttributes, JobQualityTypeCreationAttributes } from '@types';
import JobPriorityType from '@models/job_priority_type';
import { sql } from '@root/sql';

interface JobQualityTypeInstance
  extends Model<JobQualityTypeAttributes, JobQualityTypeCreationAttributes>,
  JobQualityTypeAttributes {}

type JobQualityTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobQualityTypeInstance;
};

export const JobQualityType = sql.define(
  'job_quality_type',
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
) as JobQualityTypeModelStatic;

export default JobPriorityType;
