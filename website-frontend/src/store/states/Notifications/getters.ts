// SPDX-License-Identifier: Apache-2.0
import { displayUser } from './displays';
import { factoryContentPurchaseOrder } from './factoryContentPurchaseOrder';
import { NotificationInterface, NotificationsState, SingleNotificationType } from './interfaces';
import { NotificationType, NotificationReadStatusType } from '@/store/interfaces/types/NotificationType';
import { TimeFormat } from '@/helpers';

export default {
  isAllNotificationsDone: (state: NotificationsState) =>
    state.notifications.filter(
      (notification: NotificationInterface) => notification.readStatusId === NotificationReadStatusType.DONE,
    ).length === state.notifications.length,
  pendingNotifications: (state: NotificationsState) =>
    state.notifications.filter(
      (notification: NotificationInterface) => notification.readStatusId === NotificationReadStatusType.PENDING,
    ),
  getNotificationContent: () => (notification: NotificationInterface, isAdmin: boolean): SingleNotificationType => {
    switch (notification.notificationTypeId) {
      case NotificationType.JOB_UPDATED_CLIENT_QA:
        if (notification.product) {
          return {
            route: `/product/review/${notification.product.uid}`,
            linkText: `${notification.product.name}`,
            content: "Status has changed to 'Client QA'",
            time: TimeFormat.fromNow(new Date(notification.createdAt), new Date()),
          };
        }
      case NotificationType.PROJECT_CREATED:
        if (notification.project && notification.refUser) {
          return {
            route: `/purchase-orders/details/${notification.project.uid}`,
            linkText: `${notification.project.name}`,
            content: `${displayUser(notification.refUser)} has created a PO, please review client request.`,
            time: TimeFormat.fromNow(new Date(notification.createdAt), new Date()),
          };
        }
      case NotificationType.JOB_COMMENT_ADDED_ARTIST:
        if (notification.jobComment && notification.product && notification.refUser) {
          return {
            route: `/product/details/${notification.product.uid}#comment-${notification.jobComment.id}`,
            linkText: `${notification.product.name}`,
            content: `${displayUser(notification.refUser)} left a comment regarding product details.`,
            time: TimeFormat.fromNow(new Date(notification.createdAt), new Date()),
          };
        }
      case NotificationType.JOB_COMMENT_ADDED_CLIENT:
        if (notification.jobComment && notification.product && notification.refUser) {
          return {
            route: `/product/details/${notification.product.uid}#comment-${notification.jobComment.id}`,
            linkText: `${notification.product.name}`,
            content: `${displayUser(notification.refUser)} left a comment regarding product details.`,
            time: TimeFormat.fromNow(new Date(notification.createdAt), new Date()),
          };
        }
      case NotificationType.PURCHASE_ORDER:
        return factoryContentPurchaseOrder(notification, isAdmin);
      default:
        return undefined;
    }
  },
};
