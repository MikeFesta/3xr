// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { JobCommentAttributes, JobCommentCreationAttributes } from '@types';
import { User } from '@models/user';
import { Job } from '@models/jobs/job';
import { JobCommentType } from '@models/job_comment_type';
import { sql } from '@root/sql';

const op = Sequelize.Op;

interface JobCommentInstance extends Model<JobCommentAttributes, JobCommentCreationAttributes>, JobCommentAttributes {}

type JobCommentModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): JobCommentInstance;
};

export const JobComment = sql.define(
  'job_comment',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    content: {
      allowNull: false,
      defaultValue: '',
      type: Sequelize.TEXT,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    deleted: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
    jobUid: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    jobCommentType: {
      allowNull: false,
      type: Sequelize.INTEGER,
    },
    parentCommentId: {
      allowNull: true,
      type: Sequelize.INTEGER,
      defaultValue: null,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    underscored: true,
    defaultScope: {
      order: [['createdAt', 'DESC']],
    },
    scopes: {
      forNotifications: {
        attributes: ['id'],
      },
    },
  },
) as JobCommentModelStatic;

export default JobComment;

JobComment.hasOne(Job, {
  as: 'job',
  foreignKey: 'uid',
  sourceKey: 'jobUid',
});

JobComment.hasOne(JobCommentType, {
  as: 'commenttype',
  foreignKey: 'id',
  sourceKey: 'jobCommentType',
});

JobComment.hasOne(User, {
  as: 'user',
  foreignKey: 'id',
  sourceKey: 'userId',
});

JobComment.hasMany(JobComment, {
  as: 'childComment',
  foreignKey: 'parentCommentId',
});

// We could technically filter based on just the comment type but, query is far more secure.
JobComment.addScope(
  'commentsForJob',
  // @ts-ignore
  (commentFilter: { jobUid: string; authorUserIds: string[]; jobCommentType: number }) => {
    const order = [['createdAt', 'DESC']];
    const userScope = 'forComments';
    const whereJobCommentTypeMatches = {
      jobCommentType: commentFilter.jobCommentType,
    };
    const whereUser = {
      [op.or]: [
        {
          id: commentFilter.authorUserIds,
        },
        {
          admin: true,
        },
      ],
    };
    return {
      include: [
        {
          as: 'childComment',
          include: [
            {
              nested: true,
              as: 'user',
              model: User.scope(userScope),
              where: whereUser,
            },
          ],
          model: JobComment,
          order,
          required: false,
          separate: true,
          where: whereJobCommentTypeMatches,
        },
        {
          as: 'user',
          model: User.scope(userScope),
          where: whereUser,
        },
      ],
      order,
      where: {
        jobUid: commentFilter.jobUid,
        parentCommentId: null,
        ...whereJobCommentTypeMatches,
      },
    };
  },
);
