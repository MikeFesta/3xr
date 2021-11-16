<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrderTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { ProjectInterface } from '@/store/interfaces/Project';
import store from '@/store/index';
import DialogComponent from '@/components/dialog/DialogComponent.vue';
import { TimeFormat } from '@/helpers';

interface PurchaseOrderTableHeader {
  text: string;
  align: 'left' | 'center' | 'right';
  value: string;
  class?: string;
}

export default Vue.extend({
  name: 'purchase-order-table',
  components: {
    DialogComponent,
  },
  computed: {
    headers(): PurchaseOrderTableHeader[] {
      let headers: PurchaseOrderTableHeader[] = [];
      if (this.isAdmin || this.isStudioAdmin) {
        headers.push({
          text: 'Client',
          align: 'left',
          value: 'client.name',
          class: 'nowrap',
        });
      }
      if (this.isAdmin || this.isClient) {
        headers.push({
          text: 'Studio',
          align: 'left',
          value: 'studio.name',
          class: 'nowrap',
        });
      }
      headers.push({
        text: 'PO Name',
        align: 'left',
        value: 'name',
        class: 'nowrap',
      });
      headers.push({
        text: 'Model Count',
        align: 'left',
        value: 'jobCount',
        class: 'nowrap',
      });
      headers.push({
        text: 'Delivery Date',
        align: 'center',
        value: 'dateDue',
        class: 'nowrap',
      });
      headers.push({
        text: 'Updated Date',
        align: 'center',
        value: 'updatedAt',
        class: 'nowrap',
      });
      headers.push({
        text: 'Order Status',
        align: 'center',
        value: 'status.name',
        class: 'nowrap',
      });
      return headers;
    },
    isAdmin: () => store.getters.user.isAdmin,
    isClient: () => store.getters.user.isClient,
    isStudioAdmin: () => store.getters.user.isStudioAdmin,
  },
  data: () => ({
    search: '',
    sortBy: 'updatedAt',
    sortDesc: true,
    isDialogOpen: false,
    dialogBodyText: '',
    allowedToDelete: false,
    selectedProjectUid: '',
  }),
  methods: {
    formatDate(dateString: string) {
      return TimeFormat.dateStringYYYYMMDD(new Date(dateString));
    },
    selectProject(project: ProjectInterface) {
      this.$router.push(`/purchase-orders/products/${project.uid}`);
    },
    handleDelete(project: ProjectInterface) {
      this.allowedToDelete = false;
      this.selectedProjectUid = project.uid;
      if (project.status.id > 1) {
        this.dialogBodyText =
          'This purchase order is currently in progress, if you would like to stop production please reach out to 3XR directly.';

        if (this.isAdmin) {
          this.allowedToDelete = true;
          this.dialogBodyText =
            'Are you sure you want to delete your purchase order? Models have been assigned out and are currently in progress with our modelers.';
        }
      } else {
        this.allowedToDelete = true;
        this.dialogBodyText =
          'Are you sure want to delete your purchase order? All of the content within it will be permanently deleted from 3XR.';
      }
      this.openDialog();
    },
    async deletePurchaseOrder() {
      await store.dispatch.project.deleteProject(this.selectedProjectUid);
      this.closeDialog();
    },
    openDialog() {
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
  },
  props: {
    admin: Boolean,
    loading: Boolean,
    projects: { type: Array, required: true },
    title: { type: String, required: true },
  },
});
</script>

<style lang="scss">
.status-container {
  display: flex;
  justify-content: space-between;
  .name {
    flex: 1;
  }
}
.nowrap {
  white-space: nowrap;
}
</style>
