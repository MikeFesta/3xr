<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/notifications/NotificationCenter.pug">
</template>

<script lang="ts">
import store from '@/store/index';
import { mapState, mapGetters } from 'vuex';
import SingleNotification from './SingleNotification.vue';

export default {
  name: 'notification-center',
  components: {
    SingleNotification,
  },
  computed: {
    ...mapState({
      user: (state: any) => state.user.user,
      notifications: (state: any) => state.notifications.notifications,
    }),
    ...mapGetters('notifications', [
      'isAllNotificationsDone',
      'isJobUpdatedToClientQA',
      'isProjectCreated',
      'isJobCommentAddedArtist',
      'isJobCommentAddedClient',
    ]),
    pendingNotifications: () => store.getters.notifications.pendingNotifications,
    userRole: () => store.getters.user.role,
  },
  methods: {
    markAllRead() {
      store.dispatch.notifications.markAllRead();
    },
    clearAll() {
      store.dispatch.notifications.clearAll();
    },
  },
};
</script>

<style lang="scss">
.notification-center-wrapper {
  padding: 10px;
  .v-btn {
    width: 32px !important;
  }
}
.list {
  min-width: 500px;
  max-width: 800px;
}
.heading {
  display: flex;
  flex: 1;
  justify-content: space-between;
}
.heading-button {
  opacity: 0.7;
  white-space: nowrap;
  font-size: 0.75rem;
  &:hover {
    text-decoration: underline;
  }
}
.secondary-text {
  font-size: 0.75rem;
  opacity: 0.7;
}
</style>
