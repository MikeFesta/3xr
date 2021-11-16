// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobDeadlineSnapshotCreationAttributes, JobDeadlineSnapshotAttributes } from '@types';
import { Job } from '@models/jobs/job';
import { JobDeadlineType } from '@models/jobs/job_deadline_type';
import { sql } from '@root/sql';

interface JobDeadlineSnapshotInstance
  extends Model<JobDeadlineSnapshotAttributes, JobDeadlineSnapshotCreationAttributes>,
  JobDeadlineSnapshotAttributes {}

type JobDeadlineSnapshotModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobDeadlineSnapshotInstance;
  recordDailySnapshot(): Promise<any>;
};

export const JobDeadlineSnapshot = sql.define(
  'job_deadline_snapshot',
  {
    date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jobCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    typeId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['date', 'type_id'],
      },
    ],
    scopes: {
      basic: {
        attributes: ['date', 'jobCount', 'typeId'],
      },
    },
  },
) as JobDeadlineSnapshotModelStatic;

export default JobDeadlineSnapshot;

// Joins
JobDeadlineSnapshot.hasOne(JobDeadlineType, {
  as: 'type',
  foreignKey: 'id',
  sourceKey: 'typeId',
});

JobDeadlineSnapshot.recordDailySnapshot = () => {
  return new Promise((resolve: Function, reject: Function) => {
    Promise.all([
      Job.scope(['open', 'deadlineNoRisk']).count(),
      Job.scope(['open', 'deadlineRisk']).count(),
      Job.scope(['open', 'deadlineToday']).count(),
      Job.scope(['open', 'deadlinePastDue']).count(),
    ])
      .then((results: any) => {
        const snapshotData = results.map((result: number, index: number) => {
          return {
            date: moment().tz('America/New_York').format('YYYY-MM-DD'),
            jobCount: result,
            typeId: index + 1,
          };
        });
        return JobDeadlineSnapshot.bulkCreate(snapshotData);
      })
      .then((results: any) => {
        resolve('success');
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};
