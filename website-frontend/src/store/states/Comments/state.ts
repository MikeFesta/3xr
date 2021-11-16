// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import backend from '@/services/3xrCom';
import { RootState } from '@/store/index';
import { reverseChildComments } from '@/helpers';
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';
import getters from '@/store/states/Comments/getters';
import { CommentInterface, CommentRequest, CommentResponse } from '@/store/interfaces/Comment';
import { AxiosResponse } from 'axios';

export interface CommentsState {
  artist: CommentInterface[];
  client: CommentInterface[];
}

export default {
  namespaced: true as true,
  state: {
    artist: [],
    client: [],
  } as CommentsState,
  mutations: {
    SET_ARTIST_COMMENT(state: CommentsState, comments: CommentInterface[]) {
      state.artist = comments;
    },
    SET_CLIENT_COMMENT(state: CommentsState, comments: CommentInterface[]) {
      state.client = comments;
    },
    SET_ADMIN_COMMENT(state: CommentsState, comments: CommentsState) {
      state.client = comments.client;
      state.artist = comments.artist;
    },
    REMOVE_ARTIST_COMMENT(state: CommentsState, commentId: Number) {
      state.artist = state.artist.filter((comment: CommentInterface) => comment.id !== commentId);
    },
    REMOVE_CLIENT_COMMENT(state: CommentsState, commentId: Number) {
      state.client = state.client.filter((comment: CommentInterface) => comment.id !== commentId);
    },
  },
  getters,
  actions: {
    async fetchComments({ commit, rootState, rootGetters }: ActionContext<CommentsState, RootState>) {
      if (rootState.product.product.job) {

        const role = rootGetters['user/role'];
        const jobUid = rootState.product.product.job.uid;
        const result = await backend.get(`/job/${jobUid}/comments/${role}`);

        const artist = reverseChildComments(result.data.artist);
        const client = reverseChildComments(result.data.client);

        switch (role) {
          case USER_ROLE_NAME.ARTIST:
            commit('SET_ARTIST_COMMENT', artist);
            break;
          case USER_ROLE_NAME.CLIENT:
            commit('SET_CLIENT_COMMENT', client);
            break;
          case USER_ROLE_NAME.QA:
          case USER_ROLE_NAME.ADMIN:
            commit('SET_ADMIN_COMMENT', { artist, client });
        }
      }
    },
    async createComment(
      { dispatch }: ActionContext<CommentsState, RootState>,
      comment: CommentRequest,
    ): Promise<CommentResponse[]> {
      const createdComment: AxiosResponse<CommentResponse[]> = await backend.post(
        `/job/${comment.jobUid}/comments/create`,
        comment,
      );
      await dispatch('fetchComments');
      return createdComment.data;
    },
    async deleteComment({ dispatch }: ActionContext<CommentsState, RootState>, comment: CommentRequest) {
      await backend.post(`/job/${comment.jobUid}/comments/mark_deleted/${comment.id}`);
      await dispatch('fetchComments');
    },
    async updateComment({ dispatch }: ActionContext<CommentsState, RootState>, comment: CommentRequest) {
      await backend.post(`/job/${comment.jobUid}/comments/update/${comment.id}`, comment);
      await dispatch('fetchComments');
    },
  },
};
