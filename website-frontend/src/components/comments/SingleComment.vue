<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/comments/SingleComment.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import NewComment from './NewComment.vue';
import { CommentInterface, CommentRequest } from '@/store/interfaces/Comment';
import store from '@/store';
import ColorSet from '@/store/interfaces/ColorSet';
import { getCommentHashId } from '@/helpers';
import { mapState } from 'vuex';
import { PropType } from 'vue';
import { TimeFormat } from '@/helpers';

interface SingleCommentProps {
  comment: CommentInterface;
  active: boolean;
  tab: number;
}

export default Vue.extend({
  name: 'single-comment',
  components: {
    NewComment,
  },
  props: {
    comment: {
      type: Object as PropType<CommentInterface>,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
    tab: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isEdit: false,
      isExpanded: false,
      isReply: false,
    };
  },
  created() {
    if (this.$route.hash) {
      const id = getCommentHashId(this.$route.hash);

      // if comment id present in hash is inside folded portion of comments.
      const shouldExpand = this.comment.childComment?.find((comment) => comment.id === id);
      if (shouldExpand) {
        this.expandNestedComments();
      }
    }
  },
  mounted() {
    if (this.$route.hash) {
      const commentHashId = getCommentHashId(this.$route.hash);
      this.scrollToComment(commentHashId);
    }
  },
  watch: {
    '$route.hash': function (hash) {
      if (hash) {
        const commentHashId = getCommentHashId(this.$route.hash);
        this.scrollToComment(commentHashId);
      }
    },
  },
  computed: {
    ...mapState({
      user: (state: any) => state.user.user,
    }),
    userInitials: () => store.getters.user.initials,
    commentUserInitials(): string {
      return store.getters.user.getInitials(this.comment.user);
    },
    displayedIdentity(): string {
      return store.getters.user.getUserDisplayedIdentity(this.comment.user);
    },
    time(): string {
      // TODO: this should use server time instead of local time to compute the difference
      return TimeFormat.fromNow(new Date(this.comment.updatedAt), new Date());
    },
    localComment(): CommentInterface {
      return { ...this.comment };
    },
    avatarColor(): string {
      const Color = new ColorSet('');
      if (this.localComment.user.admin) {
        return Color.orange;
      } else {
        if (this.localComment.user.primaryRoleId === 1) {
          return Color.purple;
        }
      }
      return Color.blue;
    },
    shouldShowExpand(): boolean {
      return !!this.comment.childComment && !!this.comment.childComment.length && !this.isExpanded;
    },
    isChildComment(): boolean {
      return !this.comment.childComment && !!this.comment.parentCommentId;
    },
    commentId(): string {
      return `comment-${this.comment.id}`;
    },
    isOwner(): boolean {
      return this.user.id === this.localComment.userId;
    },
  },
  methods: {
    handleEdit(): void {
      this.isEdit = true;
    },
    handleReplyToParent(id: number): void {
      this.isReply = false;
      this.scrollToComment(id);
    },
    async handleDelete(): Promise<void> {
      const comment: CommentRequest = {
        content: this.comment.content,
        jobUid: this.comment.jobUid,
        userId: this.comment.user.id,
        jobCommentType: this.comment.jobCommentType,
        parentCommentId: this.comment.parentCommentId,
        id: this.comment.id,
      };
      await store.dispatch.comments.deleteComment(comment);
    },
    async handleSave(): Promise<void> {
      const comment: CommentRequest = {
        content: this.comment.content,
        jobUid: this.comment.jobUid,
        userId: this.comment.user.id,
        jobCommentType: this.comment.jobCommentType,
        parentCommentId: this.comment.parentCommentId,
        id: this.comment.id,
      };
      await store.dispatch.comments.updateComment(comment);
      this.handleCancelEdit();
    },
    handleCancelEdit(): void {
      this.isEdit = false;
    },
    handleReply(): void {
      if (this.localComment.childComment?.length) {
        this.expandNestedComments();

        // focus to last comment in the thread
        const hashCommentId = this.localComment.childComment[this.localComment.childComment.length - 1].id;
        const hashComment = `#comment-${hashCommentId}`;
        this.$router.push(`${this.$route.fullPath.split('#')[0]}#comment-${hashCommentId}`);
      }
      this.isReply = true;
    },
    expandNestedComments(): void {
      this.isExpanded = true;
    },
    scrollToComment(id: number): void {
      const el = document.getElementById(`comment-${id}`);
      if (el && this.comment.id === id) {
        el.scrollIntoView(true);
      }
    },
  },
});
</script>

<style lang="scss">
@import '@/styles/variables.scss';

@media screen and (max-width: 600px) {
  .author {
    .time {
      width: 100%;
      flex: none;
      text-align: left;
    }
  }
}
.initials {
  font-size: 1.2rem;
}
.time {
  flex: 1;
  text-align: end;
}
.author {
  color: $color-dark-gray;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  position: relative;
}
.edit {
  font-size: 0.875rem;
  color: $color-light-blue;
  position: absolute;
  top: 2rem;
  right: 0;
  cursor: pointer;

  * {
    margin-right: 0.5rem;
  }
}
.content {
  cursor: pointer;
}
.child-comments {
  width: 100%;
}
.show-more {
  font-size: 0.875rem;
  color: $color-light-blue;
  cursor: pointer;
  text-align: center;
}
</style>
