// SPDX-License-Identifier: Apache-2.0
import { UserInterface } from './User';
import { USER_ROLE_NAME } from './types/UserRoleType';

export interface CommentInterface {
  id: number;
  userId: number;
  userName: string;
  userRole: USER_ROLE_NAME;
  content: string;
  date: string;
  user: UserInterface;
  updatedAt: string;
  jobUid: string;
  jobCommentType: number;
  childComment?: CommentInterface[];
  parentCommentId?: number;
}

export interface CommentRequest {
  content: string;
  jobId?: number;
  jobUid: string;
  userId: number;
  jobCommentType: number;
  parentCommentId?: number;
  id?: number;
}

export interface CommentResponse {
  deleted: boolean;
  id: number;
  content: string;
  jobUid: string;
  jobCommentType: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}
