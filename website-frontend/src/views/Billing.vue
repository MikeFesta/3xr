<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/Billing.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'billing',
  metaInfo: {
    title: 'Billing | 3XR',
  },
  created: async function () {
    try {
      this.loading = true;
      const currentMonthDate = new Date();
      const currentMonth =
        currentMonthDate.getFullYear() + (currentMonthDate.getMonth() + 1).toString().padStart(2, '0');
      const lastMonthDate = new Date();
      lastMonthDate.setDate(0);
      const lastMonth = lastMonthDate.getFullYear() + (lastMonthDate.getMonth() + 1).toString().padStart(2, '0');
      const billingInfo = await backend.post('/studio/billing', { currentMonth, lastMonth });
      if (billingInfo.status != 200) {
        throw 'Error Fetching Data';
      }
      this.currentMonthJobsComplete = billingInfo.data.currentMonthJobsComplete;
      this.lastMonthJobsComplete = billingInfo.data.lastMonthJobsComplete;
      this.pendingJobs = billingInfo.data.pendingJobs;
      this.loading = false;
    } catch (err: any) {
      this.errorMessage = err;
      this.loading = false;
    }
  },
  components: {
    ...vuetifyComponents,
  },
  computed: {
    currentMonthBalance: function (): string {
      const balance = this.currentMonthJobsComplete.reduce((total: number, job: any) => {
        return total + job.billingPlatformCharge;
      }, 0);
      return '$' + balance + '.00';
    },
    currentMonthLabel: function (): string {
      const currentMonth = new Date();
      return currentMonth.toLocaleString('default', { month: 'long' }) + ' ' + currentMonth.getFullYear();
    },
    lastMonthBalance: function (): string {
      const balance = this.lastMonthJobsComplete.reduce((total: number, job: any) => {
        return total + job.billingPlatformCharge;
      }, 0);
      return '$' + balance + '.00';
    },
    lastMonthLabel: function (): string {
      const lastMonth = new Date();
      lastMonth.setDate(0); // First day of last month
      return lastMonth.toLocaleString('default', { month: 'long' }) + ' ' + lastMonth.getFullYear();
    },
    pendingCosts: function (): string {
      const balance = this.pendingJobs.reduce((total: number, job: any) => {
        return total + job.billingPlatformCharge;
      }, 0);
      return '$' + balance + '.00';
    },
  },
  data: () => ({
    currentMonthJobsComplete: [],
    errorMessage: '',
    lastMonthJobsComplete: [],
    loading: true,
    pendingJobs: [],
    showCurrentMonthJobsComplete: false,
    showLastMonthJobsComplete: false,
  }),
});
</script>
