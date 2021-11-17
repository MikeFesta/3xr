// SPDX-License-Identifier: Apache-2.0
export interface NotificationContent {
  id: number;
  content: string;
  projectUid?: number;
  projectName: string;
}

export enum NotificationStatus {
  UNSUBMITTED = 1,
  PENDING = 2,
  ACCEPTED = 3,
  IN_PROGRESS = 4,
  SUBMITTED_25 = 5,
  SUBMITTED_50 = 6,
  SUBMITTED_75 = 7,
  SUBMITTED_100 = 8,
  COMPLETED = 9,
  CANCELLED = 10,
}

export interface NotificationEvent {
  status: NotificationStatus;
  contents: NotificationContent[];
  type: number;
}

export enum NotificationTypeEnum {
  JOB_UPDATED_TO_CLIENT_QA = 1,
  PROJECT_CREATED = 2,
  JOB_COMMENT_ADDED_ARTIST = 3,
  JOB_COMMENT_ADDED_CLIENT = 4,
  PURCHASE_ORDER = 5,
}
