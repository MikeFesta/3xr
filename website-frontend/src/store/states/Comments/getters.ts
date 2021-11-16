// SPDX-License-Identifier: Apache-2.0
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';
import { CommentInterface } from '@/store/interfaces/Comment';

/*
  Returns first 3 comments unless `requestedId` is given, in which case it tries to find
  a comment with requested ID in either parent or child comments, and returns all comments
  up to and including a comment with the requestedID
*/
const findInitialComments = (comments: CommentInterface[], requestedId?: number) => {
  if (requestedId) {
    const idx = comments.findIndex((comment: CommentInterface) => {
      return (
        comment.id === requestedId ||
        comment.childComment?.find((childComment: CommentInterface) => childComment.id === requestedId)
      );
    });

    if (idx >= 3) {
      return comments.slice(0, idx + 1);
    } else {
      return comments.slice(0, 3);
    }
  }

  return comments.slice(0, 3);
};

export default {
  initialComments: (state: any, getters: any, rootState: any, rootGetters: any) => (
    tabId: number,
    commentId?: number,
  ) => {
    const role = rootGetters['user/role'];
    if (role === USER_ROLE_NAME.ADMIN || role === USER_ROLE_NAME.QA) {
      if (tabId === 0) {
        return findInitialComments(state.client, commentId);
      } else {
        return findInitialComments(state.artist, commentId);
      }
    }
    return findInitialComments(state[role], commentId);
  },
};
