<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/comments/CommentsComponent.pug">
</template>

<script lang="ts">
// DEPRICATED
import Vue from 'vue';
import { mapState } from 'vuex';
import NewComment from './NewComment.vue';
import SingleComment from './SingleComment.vue';
import store from '@/store/index';
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';
import { getCommentHashId } from '@/helpers';

export enum CommentTab {
  CLIENT = 0,
  ARTIST = 1,
  ADMIN = 2,
}

export default Vue.extend({
  name: 'comments-component',
  created() {
    this.fetchComments();

    this.polling = window.setInterval(() => {
      this.fetchComments();
    }, 300000);
  },
  beforeDestroy() {
    clearInterval(this.polling);
  },
  computed: {
    ...mapState({
      comments: (state: any) => state.comments,
      product: (state: any) => state.product.product,
    }),
    isAdmin: () => store.getters.user.isAdmin,
    isQa: () => store.getters.user.isQa,
    role: () => store.getters.user.role,
    initials: () => store.getters.user.initials,
    initialComments: () => store.getters.comments.initialComments,
    visibleComments(): any {
      const requestedId = getCommentHashId(this.$route.hash);
      return this.showAll ? this.showAllComments() : this.initialComments(this.tab, requestedId);
    },
    shouldShowMore(): boolean {
      let commentsLength = 0;
      if (this.role === USER_ROLE_NAME.ADMIN || this.role === USER_ROLE_NAME.QA) {
        if (this.tab === CommentTab.CLIENT) {
          commentsLength = this.comments.client.length;
        } else {
          commentsLength = this.comments.artist.length;
        }
      } else {
        commentsLength = this.comments[this.role].length;
      }

      return !this.showAll && this.visibleComments.length < commentsLength;
    },
  },
  components: {
    SingleComment,
    NewComment,
  },
  data: function () {
    return {
      activeIndex: null,
      showAll: false,
      tab: 0,
      polling: 0,
    };
  },
  watch: {
    tab: function (): void {
      this.fetchComments();
    },
    role: function (): void {
      this.fetchComments();
    },
  },
  methods: {
    showAllComments() {
      if (this.role === USER_ROLE_NAME.ADMIN) {
        if (this.tab === CommentTab.CLIENT) {
          return this.comments.client;
        }
        if (this.tab === CommentTab.ARTIST) {
          return this.comments.artist;
        }
      } else {
        return this.comments[this.role];
      }
    },
    setActiveIndex(idx: any) {
      this.activeIndex = idx;
    },
    removeActiveIndex() {
      this.activeIndex = null;
    },
    handleShowMore() {
      this.showAll = true;
    },
    fetchComments() {
      store.dispatch.comments.fetchComments();
    },
  },
});
</script>

<style lang="scss">
@import 'src/styles/variables.scss';

.comments {
  font-weight: bold;
  padding-top: 15px;
}

.previous {
  font-size: 0.875rem;
  color: $color-light-blue;
  cursor: pointer;
}
</style>
