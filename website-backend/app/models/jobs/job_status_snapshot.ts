// SPDX-License-Identifier: Apache-2.0
import moment from 'moment';
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobStatusSnapshotAttributes, JobStatusSnapshotCreationAttributes } from '@types';
import { JobStatusTypeEnum } from '@enums';
import { Job } from '@models/jobs/job';
import { sql } from '@root/sql';

import Log from '@root/log';

interface JobStatusSnapshotInstance
  extends Model<JobStatusSnapshotAttributes, JobStatusSnapshotCreationAttributes>,
  JobStatusSnapshotAttributes {}

type JobStatusSnapshotModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobStatusSnapshotInstance;
  recordDailySnapshot(): Promise<any>;
};

export const JobStatusSnapshot = sql.define(
  'job_status_snapshot',
  {
    date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    jobCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    jobStatusId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    dayIndex: Sequelize.VIRTUAL,
  },
  {
    getterMethods: {
      dayIndex: function (this: any) {
        // This is used on the frontend to bucket results into the past 7 days
        const day = new Date(this.date);
        const now = new Date();
        const index = Math.ceil((now.getTime() - day.getTime()) / 1000 / 60 / 60 / 24); // 1-7
        return (7 - index); // Today = 6
      },
    },
    scopes: {
      basic: {
        attributes: ['date', 'jobCount', 'jobStatusId'],
      },
    },
    indexes: [
      {
        unique: true,
        fields: ['date', 'job_status_id'],
      },
    ],
  },
) as JobStatusSnapshotModelStatic;

export default JobStatusSnapshot;

JobStatusSnapshot.recordDailySnapshot = () => {
  return new Promise((resolve: Function, reject: Function) => {
    Job.findAll({
      group: ['statusId'],
      attributes: ['statusId', [Sequelize.fn('COUNT', 'statusId'), 'statusCount']],
    })
      .then(results => {
        const snapshotData = results.map(result => {
          return {
            date: moment.tz('America/New_York').format('YYYY-MM-DD'),
            jobCount: result.get('statusCount') || 0,
            jobStatusId: result.statusId || JobStatusTypeEnum.UNASSIGNED,
          };
        });
        Log.debug(JSON.stringify(snapshotData));
        return JobStatusSnapshot.bulkCreate(snapshotData);
      })
      .then(insertResult => {
        resolve('success');
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};
