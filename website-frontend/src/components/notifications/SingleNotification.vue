<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./SingleNotification.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store';
import { NotificationInterface, SingleNotificationType } from '@/store/states/Notifications/interfaces';
import { PropType } from 'vue';

export default Vue.extend({
  name: 'single-notification',
  data() {
    return {
      route: null,
      content: null,
      date: null,
    };
  },
  computed: {
    isAdmin(): boolean {
      return store.getters.user.isAdmin;
    },
    current(): SingleNotificationType {
      return store.getters.notifications.getNotificationContent(this.notification, store.getters.user.isAdmin);
    },
  },
  methods: {
    deleteNotification(id: string): void {
      store.dispatch.notifications.deleteNotification(id);
    },
    markRead(id: string): void {
      store.dispatch.notifications.markNotificationRead(id);
    },
  },
  props: {
    notification: {
      type: Object as PropType<NotificationInterface>,
      required: true,
    },
  },
});
</script>

<style lang="scss">
.list-item {
  width: 100%;
  display: flex;
  align-items: center;
}
.list-content {
  margin: 1rem;
  width: 100%;
}
.list-title {
  display: block;
}
.buttons-container {
  display: flex;
  width: 50px;
  .read-notification {
    margin-left: auto;
  }
}
</style>
