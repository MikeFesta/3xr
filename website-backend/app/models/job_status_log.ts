// SPDX-License-Identifier: Apache-2.0
import * as moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobStatusLogAttributes, JobStatusLogCreationAttributes } from '@types';
import { Job } from '@models/jobs/job';
import { JobStatusType } from '@models/job_status_type';
import { sql } from '@root/sql';

interface JobStatusLogInstance
  extends Model<JobStatusLogAttributes, JobStatusLogCreationAttributes>,
  JobStatusLogAttributes {}

type JobStatusLogModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobStatusLogInstance;
};

export const JobStatusLog = sql.define(
  'job_status_log',
  {
    jobId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    statusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any) {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('YYYY-MM-DD h:mm:ssa');
      },
    },
  },
) as JobStatusLogModelStatic;

export default JobStatusLog;

JobStatusLog.hasOne(Job, {
  as: 'job',
  foreignKey: 'id',
  sourceKey: 'jobId',
});

JobStatusLog.hasOne(JobStatusType, {
  as: 'status',
  foreignKey: 'id',
  sourceKey: 'statusId',
});
