// SPDX-License-Identifier: Apache-2.0
import NotificationModel from '@models/notification';
import Job from '@models/jobs/job';
import Client from '@models/client';
import UserClient from '@models/user_client';
import User from '@models/user';
import {
  NotificationEvent,
  NotificationTypeEnum,
  NotificationContent,
  NotificationStatus,
} from '../interfaces/Notification';
import Helpers from '@root/helpers';
import { JobStatusTypes } from '../interfaces/JobStatus';

async function send(event: NotificationEvent) {
  await Promise.all(
    event.contents.map(
      async (content: NotificationContent) =>
        await NotificationModel.create({
          userId: content.id,
          readStatusId: 1,
          notificationTypeId: event.type,
          payload: {
            content: content.content,
            projectUid: content.projectUid,
            projectName: content.projectName,
          },
        }),
    ),
  );
}

async function getNotificationForProject(project: any): Promise<NotificationEvent | null> {
  const client = await Client.findOne({
    where: {
      id: project.clientId,
    },
  });
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

  const completionMap = Helpers.getProjectCompletionMap(jobs);

  const isPoComplete = completionMap.get(JobStatusTypes.COMPLETE) === jobs.length;
  if (isPoComplete) {
    // remove duplicate id's since some users can be both admin and client.
    const contents = [
      ...userClients.map(({ userId }) => ({
        id: userId,
        content: `Production for ${project.name} has been completed`,
        projectUid: project.uid,
        projectName: project.name,
      })),
      ...admins.map(({ id }) => ({
        id,
        content: `Production for ${project.name} has been completed`,
        projectUid: project.uid,
        projectName: project.name,
      })),
    ].reduce((acc, curr) => {
      const isAlreadyPresent = acc.find(item => item.id === curr.id);
      if (!isAlreadyPresent) {
        return acc.concat([curr]);
      } else {
        return acc;
      }
    }, []);

    return {
      status: NotificationStatus.COMPLETED,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents,
    };
  }

  const isAllSubmitted = completionMap.get(JobStatusTypes.CLIENT_QA) === jobs.length;
  if (isAllSubmitted) {
    return {
      status: NotificationStatus.SUBMITTED_100,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          content: `100% of models within ${project.name} have been submitted for your review`,
          projectUid: project.uid,
          projectName: project.name,
        })),
        ...admins.map(({ id }) => ({
          id,
          content: `100% of models within ${project.name} have been submitted to ${client.name}`,
          projectUid: project.uid,
          projectName: project.name,
        })),
      ],
    };
  }

  const isAt75 =
    completionMap.has(JobStatusTypes.CLIENT_QA) && completionMap.get(JobStatusTypes.CLIENT_QA) / jobs.length >= 0.75;
  if (isAt75) {
    return {
      status: NotificationStatus.SUBMITTED_75,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          content: `75% of models within ${project.name} have been submitted for your review`,
          projectUid: project.uid,
          projectName: project.name,
        })),
        ...admins.map(({ id }) => ({
          id,
          content: `75% of models within ${project.name} have been submitted to ${client.name}`,
          projectUid: project.uid,
          projectName: project.name,
        })),
      ],
    };
  }

  const isAt50 =
    completionMap.has(JobStatusTypes.CLIENT_QA) && completionMap.get(JobStatusTypes.CLIENT_QA) / jobs.length >= 0.5;
  if (isAt50) {
    return {
      status: NotificationStatus.SUBMITTED_50,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          content: `50% of models within ${project.name} have been submitted for your review`,
          projectUid: project.uid,
          projectName: project.name,
        })),
        ...admins.map(({ id }) => ({
          id,
          content: `50% of models within ${project.name} have been submitted to ${client.name}`,
          projectUid: project.uid,
          projectName: project.name,
        })),
      ],
    };
  }

  const isAt25 =
    completionMap.has(JobStatusTypes.CLIENT_QA) && completionMap.get(JobStatusTypes.CLIENT_QA) / jobs.length >= 0.25;
  if (isAt25) {
    return {
      status: NotificationStatus.SUBMITTED_25,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          content: `25% of models within ${project.name} have been submitted for your review`,
          projectUid: project.uid,
          projectName: project.name,
        })),
        ...admins.map(({ id }) => ({
          id,
          content: `25% of models within ${project.name} have been submitted to ${client.name}`,
          projectUid: project.uid,
          projectName: project.name,
        })),
      ],
    };
  }

  const isInProgress =
    completionMap.has(JobStatusTypes.IN_PROGRESS) &&
    completionMap.get(JobStatusTypes.IN_PROGRESS) / jobs.length >= 0.25;
  if (isInProgress) {
    return {
      status: NotificationStatus.IN_PROGRESS,
      type: NotificationTypeEnum.PURCHASE_ORDER,
      contents: [
        ...userClients.map(({ userId }) => ({
          id: userId,
          content: `${project.name} has begun production with 3XR artists.`,
          projectUid: project.uid,
          projectName: project.name,
        })),
      ],
    };
  }

  return null;
}

module.exports = {
  send,
  getNotificationForProject,
};
