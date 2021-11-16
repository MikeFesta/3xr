// SPDX-License-Identifier: Apache-2.0
import { Job } from '@models/jobs/job';
import { JobComment } from '@models/job_comment';
import { Project } from '@models/project';
import { Product } from '@models/product';
import { Notification } from '@models/notification';
import Log from '@root/log';

export interface DeleteRecord {
  project: number;
  jobs: number[];
  products: number[];
  comments: number[];
  notifications: number[];
}

function getUniqueFields(array: any[], fieldName: string): any[] {
  return array
    .map((sequelizeItem: any) => sequelizeItem.toJSON()[fieldName])
    .filter((item: any, index: number, arr: any[]) => arr.indexOf(item) === index);
}

/**
 * Reverts soft deletion for all ID's in DeleteRecord
 *
 * @param {DeleteRecord} record
 */
async function revertDelete(record: DeleteRecord) {
  const updateToApply = { deleted: false };
  const whereClause = (id: number) => {
    return { where: { id: id } }
  }
  for (const jobId of record.jobs) {
    await Job.update(updateToApply, whereClause(jobId));
  }
  for (const productId of record.products) {
    await Product.update(updateToApply, whereClause(productId));
  }
  for (const commentId of record.comments) {
    await JobComment.update(updateToApply, whereClause(commentId));
  }
  for (const notificationId of record.notifications) {
    await Notification.update(updateToApply, whereClause(notificationId));
  }
  await Project.update(updateToApply, whereClause(record.project));
}

/**
 * Prepares `DeleteRecord` interface which holds all ID's marked for deletion in their respective tables.
 *
 * @param {string} uid
 * @return {*}  {(Promise<DeleteRecord | null>)}
 */
export const createDeleteRecord = async function (uid: string): Promise<DeleteRecord | null> {
  const project = await Project.findOne({ where: { uid } });
  if (project) {

    const associatedJobs = await Job.findAll({
      where: {
        projectId: project.id,
      },
    });

    // list of all unique job IDs
    const associatedJobIds = getUniqueFields(associatedJobs, 'id');

    // list of all unique product IDs
    const associatedProductIds = getUniqueFields(associatedJobs, 'productId');
    const associatedJobUids = getUniqueFields(associatedJobs, 'uid');

    // for each Job ID, delete comments related to that job ID
    let associatedCommentIds: number[] = [];
    for (const jobUid of associatedJobUids) {
      const currentComments = await JobComment.findAll({
        where: {
          jobUid,
        },
      });
      const currentCommentIds = getUniqueFields(currentComments, 'id');
      associatedCommentIds = associatedCommentIds.concat(currentCommentIds);
    }

    const associatedNotifications = await Notification.findAll({
      where: {
        projectId: project.id,
      },
    });
    const associatedNotificationIds = getUniqueFields(associatedNotifications, 'id');

    return {
      project: project.id,
      jobs: associatedJobIds,
      products: associatedProductIds,
      comments: associatedCommentIds,
      notifications: associatedNotificationIds,
    };
  }
  return null;
}

/**
 * Performs soft delete updates on all IDs in DeleteRecord
 * If successful, returns `true`, otherwise it reverts changes and returns `false`
 *
 * @param {DeleteRecord} record
 * @return {*}  {Promise<boolean>}
 */
export const deleteRecords = async function (record: DeleteRecord): Promise<boolean> {
  const updateToApply = { deleted: true };
  const whereClause = (id: number) => {
    return { where: { id: id } }
  }
  try {
    for (const jobId of record.jobs) {
      await Job.update(updateToApply, whereClause(jobId));
    }
    for (const productId of record.products) {
      await Product.update(updateToApply, whereClause(productId));
    }
    for (const commentId of record.comments) {
      await JobComment.update(updateToApply, whereClause(commentId));
    }
    for (const notificationId of record.notifications) {
      await Notification.update(updateToApply, whereClause(notificationId));
    }
    await Project.update(updateToApply, whereClause(record.project));
    return true;
  } catch (err) {
    Log.error(err);
    await revertDelete(record);
    return false;
  }
}
