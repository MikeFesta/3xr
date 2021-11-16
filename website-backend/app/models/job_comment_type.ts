// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobCommentTypeAttributes, JobCommentTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface JobCommentTypeInstance
  extends Model<JobCommentTypeAttributes, JobCommentTypeCreationAttributes>,
  JobCommentTypeAttributes {}

type JobCommentTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobCommentTypeInstance;
};

export const JobCommentType = sql.define(
  'job_comment_type',
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
) as JobCommentTypeModelStatic;

export default JobCommentType;
