// SPDX-License-Identifier: Apache-2.0
import { NotificationType, NotificationReadStatusType } from '@/store/interfaces/types/NotificationType';
import { UserInterface } from '@/store/interfaces/User';

export interface IPurchaseOrder {
  content: string;
}

export interface IClient {
  id: number;
  name: string;
}
export interface IJob {
  id: number;
  name: string;
}

export interface IJobComment {
  id: number;
}

export interface IProduct {
  uid: string;
  name: string;
}

export interface IProject {
  uid: string;
  name: string;
}

export interface IUser {
  fullName: string;
  username: string;
}

export interface NotificationInterface {
  id: number;
  notificationTypeId: NotificationType;
  createdAt: string;
  updatedAt: string;
  readStatusId: NotificationReadStatusType;
  client?: IClient;
  clientId?: Number;
  jobComment?: IJobComment;
  jobCommentId?: Number;
  job?: IJob;
  jobId?: Number;
  project?: IProject;
  projectId?: Number;
  projectProgress?: Number;
  refUser?: IUser;
  refUserId?: Number;
  product?: IProduct;
  productId?: Number;
  user?: UserInterface;
  userId?: Number;
}

export interface NotificationsState {
  notifications: Array<NotificationInterface>;
}

interface ISingleNotification {
  route: string;
  linkText: string;
  content: string;
  time: string;
}

export type SingleNotificationType = ISingleNotification | undefined;

export enum ProjectProgress {
  COMPLETION_PROCESS_BEGAN = 1,
  SUBMITTED_25 = 2,
  SUBMITTED_50 = 3,
  SUBMITTED_75 = 4,
  SUBMITTED_100 = 5,
  PURCHASE_ORDER_COMPLETE = 6,
}
