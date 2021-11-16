<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/comments/NewComment.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store';
import { CommentRequest } from '@/store/interfaces/Comment';
import { mapState } from 'vuex';
import { CommentTab } from '@/components/comments/CommentsComponent.vue';
import ColorSet from '@/store/interfaces/ColorSet';
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';

export default Vue.extend({
  name: 'new-comment',
  data: function () {
    return {
      message: '',
    };
  },
  computed: {
    ...mapState({
      user: (state: any) => state.user.user,
      product: (state: any) => state.product.product,
    }),
    userRole: () => store.getters.user.role,
    isAdmin: () => store.getters.user.isAdmin,
    avatarColor() {
      const Color = new ColorSet('');
      if (this.user.admin) {
        return Color.orange;
      } else {
        if (this.user.primaryRoleId === 1) {
          return Color.purple;
        }
      }
      return Color.blue;
    },
  },
  props: {
    initials: {
      type: String,
      required: true,
    },
    tab: {
      type: Number,
      default: 0,
    },
    parentId: {
      default: undefined,
      validator: (prop) => typeof prop === 'number' || prop === undefined,
    },
    handleReplyToParent: {
      type: Function,
      default: function () {},
    },
  },
  methods: {
    handleCancel() {
      this.message = '';
    },
    async handleSave() {
      let jobCommentType = 2; // CLIENT
      if (this.isAdmin) {
        if (this.tab === CommentTab.ARTIST) {
          jobCommentType = 1;
        }
        if (this.tab === CommentTab.CLIENT) {
          jobCommentType = 2;
        }
      }
      if (this.userRole === USER_ROLE_NAME.ARTIST) {
        jobCommentType = 1;
      }

      const newComment: CommentRequest = {
        content: this.message,
        jobId: this.product.job.id,
        jobUid: this.product.job.uid,
        userId: this.user.id,
        jobCommentType,
        parentCommentId: this.parentId,
      };

      const [{ id }] = await store.dispatch.comments.createComment(newComment);

      this.handleCancel();
      this.handleReplyToParent();

      this.$router.push(`${this.$route.fullPath.split('#')[0]}#comment-${id}`);
    },
  },
});
</script>

<style lang="scss">
.initials {
  color: white;
}
</style>
