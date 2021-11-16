// SPDX-License-Identifier: Apache-2.0
import { SingleNotificationType, NotificationInterface, ProjectProgress, IClient, IProject } from './interfaces';
import { TimeFormat } from '@/helpers';

const percentCompleteContent = (isAdmin: boolean, percentComplete: number, client: IClient, project: IProject): string => {
  if (isAdmin) {
    return `${percentComplete}% of models within ${project.name} have been submitted to ${client.name}.`
  } else {
    return `${percentComplete}% of models within ${project.name} have been submitted for your review.`
  }
}

export const factoryContentPurchaseOrder = (notification: NotificationInterface, isAdmin: boolean): SingleNotificationType => {
  if (notification.project && notification.client) {
    const commonFields = {
      linkText: `${notification.project.name}`,
      route: `/purchase-orders/products/${notification.project.uid}`,
      time: TimeFormat.fromNow(new Date(notification.createdAt), new Date()), // TODO: find a way to test this
    }
    switch (notification.projectProgress) {
      case ProjectProgress.COMPLETION_PROCESS_BEGAN:
        return {
          ...commonFields,
          content: `${notification.project.name} has begun production with 3XR artists.`,
        };
      case ProjectProgress.SUBMITTED_25:
        return {
          ...commonFields,
          content: percentCompleteContent(isAdmin, 25, notification.client, notification.project),
        };
      case ProjectProgress.SUBMITTED_50:
        return {
          ...commonFields,
          content: percentCompleteContent(isAdmin, 50, notification.client, notification.project),
        };
      case ProjectProgress.SUBMITTED_75:
        return {
          ...commonFields,
          content: percentCompleteContent(isAdmin, 75, notification.client, notification.project),
        };
      case ProjectProgress.SUBMITTED_100:
        return {
          ...commonFields,
          content: percentCompleteContent(isAdmin, 100, notification.client, notification.project),
        };
      case ProjectProgress.PURCHASE_ORDER_COMPLETE:
        return {
          ...commonFields,
          content: `Production for ${notification.project.name} has been completed.`,
        };
    }
  }
}