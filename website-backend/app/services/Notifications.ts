// SPDX-License-Identifier: Apache-2.0
import { INotification, INotificationWithoutRecipient, NotificationEvent, NotificationContent } from '@types';
import { NotificationTypeEnum, JobStatusTypeEnum, NotificationStatus, ProjectProgress } from '@enums';
import Helpers from '../helpers';
import { Notification } from '@models/notification';
import { Client } from '@models/client';
import { Job } from '@models/jobs/job';
import { User } from '@models/user';
import { UserClient } from '@models/user_client';

export async function getNotificationForProject(project: any): Promise<NotificationEvent | null> {
  const client = await Client.findOne({
    where: {
      id: project.clientId,
    },
  });

  if (!client) {
    return null;
  }
  const jobs = await Job.findAll({
    where: {
      projectId: project.id,
    },
  });
  const admins = await User.findAll({
    where: {
      admin: true,
    },
  });
  const userClients = await UserClient.findAll({
    where: {
      clientId: client.id,
    },
  });
  const sharedNotificationContext = {
    clientId: client.id,
    projectId: project.id,
  };

  const completionMap = Helpers.getProjectCompletionMap(jobs);
  const isPoComplete = completionMap.get(JobStatusTypeEnum.COMPLETE) === jobs.length;
  if (isPoComplete) {
    // remove duplicate id's since some users can be both admin and client.
    const contentsAll: NotificationContent[] = [
      ...userClients.map(({ userId }) => ({
        id: userId,
        projectProgress: ProjectProgress.PURCHASE_ORDER_COMPLETE,
      })),
      ...admins.map(({ id }) => ({
        id,
        projectProgress: ProjectProgress.PURCHASE_ORDER_COMPLETE,
      })),
    ];

    const contents = contentsAll.reduce((acc: NotificationContent[], curr: NotificationContent) => {
      const isAlreadyPresent = acc.find(item => item.id === curr.id);
      if (!isAlreadyPresent) {
        return acc.concat([curr]);
      } else {
        return acc;
      }
    }, []);
    return {
      ...sharedNotificationContext,
      status: NotificationStatus.COMPLETED,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents,
    };
  }

  const isAllSubmitted = completionMap.get(JobStatusTypeEnum.CLIENT_QA) === jobs.length;
  if (isAllSubmitted) {
    return {
      ...sharedNotificationContext,
      status: NotificationStatus.SUBMITTED_100,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          projectProgress: ProjectProgress.SUBMITTED_100,
        })),
        ...admins.map(({ id }) => ({
          id,
          projectProgress: ProjectProgress.SUBMITTED_100,
        })),
      ],
    };
  }

  const isAt75 =
    (completionMap.has(JobStatusTypeEnum.CLIENT_QA) && completionMap.get(JobStatusTypeEnum.CLIENT_QA)) ||
    0 / jobs.length >= 0.75;
  if (isAt75) {
    return {
      ...sharedNotificationContext,
      status: NotificationStatus.SUBMITTED_75,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          projectProgress: ProjectProgress.SUBMITTED_75,
        })),
        ...admins.map(({ id }) => ({
          id,
          projectProgress: ProjectProgress.SUBMITTED_75,
        })),
      ],
    };
  }

  const isAt50 =
    (completionMap.has(JobStatusTypeEnum.CLIENT_QA) && completionMap.get(JobStatusTypeEnum.CLIENT_QA)) ||
    0 / jobs.length >= 0.5;
  if (isAt50) {
    return {
      ...sharedNotificationContext,
      status: NotificationStatus.SUBMITTED_50,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          projectProgress: ProjectProgress.SUBMITTED_50,
        })),
        ...admins.map(({ id }) => ({
          id,
          projectProgress: ProjectProgress.SUBMITTED_50,
        })),
      ],
    };
  }

  const isAt25 =
    (completionMap.has(JobStatusTypeEnum.CLIENT_QA) && completionMap.get(JobStatusTypeEnum.CLIENT_QA)) ||
    0 / jobs.length >= 0.25;
  if (isAt25) {
    return {
      ...sharedNotificationContext,
      status: NotificationStatus.SUBMITTED_25,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          projectProgress: ProjectProgress.SUBMITTED_25,
        })),
        ...admins.map(({ id }) => ({
          id,
          projectProgress: ProjectProgress.SUBMITTED_25,
        })),
      ],
    };
  }

  const isInProgress =
    (completionMap.has(JobStatusTypeEnum.IN_PROGRESS) && completionMap.get(JobStatusTypeEnum.IN_PROGRESS)) ||
    0 / jobs.length >= 0.25;
  if (isInProgress) {
    return {
      ...sharedNotificationContext,
      status: NotificationStatus.IN_PROGRESS,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          projectProgress: ProjectProgress.COMPLETION_PROCESS_BEGAN,
        })),
      ],
    };
  }

  return null;
}

export async function sendJobProgressNotification(event: NotificationEvent) {
  await Promise.all(
    event.contents.map(
      async (content: NotificationContent) =>
        await Notification.create({
          clientId: event.clientId,
          notificationTypeId: event.type,
          projectId: event.projectId,
          projectProgress: content.projectProgress,
          userId: content.id,
        }),
    ),
  );
}

export async function sendNotificationsToUserIds(
  userdIds: number[],
  notificationFields: INotificationWithoutRecipient,
  userIdToExclude?: number,
): Promise<void> {
  const userIdsToNotify = userdIds.filter(Helpers.arrayItemUniquePredicate);
  const finalRecipientUserIds = userIdToExclude
    ? userIdsToNotify.filter(userId => userId !== userIdToExclude)
    : userIdsToNotify;
  const notifications: INotification[] = finalRecipientUserIds.map(id => ({
    ...notificationFields,
    userId: id,
  }));
  await Notification.bulkCreate(notifications);
}

// User segments:

async function getAdminUserIds(): Promise<number[]> {
  const adminUsers = await User.scope('adminScope').findAll();
  return adminUsers.map(({ id }) => id);
}

async function getClientUserIds(clientId: number): Promise<number[]> {
  const userClients = await UserClient.findAll({
    where: {
      clientId: clientId,
    },
  });
  return userClients.map(({ userId }) => userId);
}

async function getJobDetails(jobUid: string): Promise<any> {
  return Job.scope({ method: ['forComments', jobUid] }).findOne();
}

// UseCases: for sending notifications to user segments

export async function sendNotificationsToAdmins(
  notificationFields: INotificationWithoutRecipient,
  userIdToExclude?: number,
): Promise<void> {
  const adminUsers = await getAdminUserIds();
  await sendNotificationsToUserIds(adminUsers, notificationFields, userIdToExclude);
}

export async function sendNotificationsToJobArtistsAndAdmins(
  jobUid: string,
  notificationFields: INotificationWithoutRecipient,
  userIdToExclude?: number,
): Promise<void> {
  const jobDetails = await getJobDetails(jobUid);
  const adminUserIds = await getAdminUserIds();
  const artistUserIds = [jobDetails.product.artistUserId];
  const finalRecipientsList = adminUserIds.concat(artistUserIds);
  await sendNotificationsToUserIds(finalRecipientsList, notificationFields, userIdToExclude);
}

export async function sendNotificationsToJobClientsAndAdmins(
  jobUid: string,
  notificationFields: INotificationWithoutRecipient,
  userIdToExclude?: number,
): Promise<void> {
  const jobDetails = await getJobDetails(jobUid);
  const adminUserIds = await getAdminUserIds();
  const clientUserIds = await getClientUserIds(jobDetails.clientId);
  const finalRecipientsList = adminUserIds.concat(clientUserIds);
  await sendNotificationsToUserIds(finalRecipientsList, notificationFields, userIdToExclude);
}
