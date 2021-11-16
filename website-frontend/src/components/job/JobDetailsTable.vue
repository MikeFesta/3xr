<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./JobDetailsTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import backend from '@/services/3xrCom';
import JobStatusType from '@/store/interfaces/types/JobStatusType';
import store from '@/store/index';

export default Vue.extend({
  name: 'job-details-table',
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    jobStatus: function () {
      return this.pickList.jobStatus.filter((status: JobStatusType) => status.id > 0);
    },
    ...mapState({
      client: (state: any) => state.client.client,
      job: (state: any) => state.job.job,
      pickList: (state: any) => state.pickList.pickList,
      product: (state: any) => state.product.product,
      user: (state: any) => state.user.user,
    }),
    role: () => store.getters.user.role,
    link: function () {
      return `/purchase-orders/details/${this.job.project.uid}`;
    },
  },
  props: {
    loading: Boolean,
  },
  data: () => ({
    errorMessage: '',
  }),
  methods: {
    changeStatus(statusId: number) {
      this.errorMessage = '';
      backend
        .post('job/set_status', {
          uid: this.job.uid,
          statusId,
        })
        .then((result) => {
          if (result.data === 'success') {
            store.dispatch.job.refresh();
            store.dispatch.product.refresh();
            store.dispatch.notifications.fetchNotifications();
          } else {
            this.errorMessage = 'Error Changing Status';
          }
        })
        .catch((err) => {
          this.errorMessage = 'Error Changing Status';
        });
    },
  },
});
</script>
