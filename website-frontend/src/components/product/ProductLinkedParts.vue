<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductLinkedParts.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import store from '@/store/index';

export default Vue.extend({
  name: 'product-linked-parts',
  components: {
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      allParts: (state: any) => state.parts.parts,
    }),
  },
  created: async function () {
    // Populate dropdowns
    store.dispatch.parts.loadAllForAdmin();
  },
  data: () => ({
    linkingPart: false,
    errorMessage: '',
    partIdToLink: 0,
    successMessage: '',
  }),
  methods: {
    clearMessages: function () {
      this.errorMessage = '';
      this.successMessage = '';
    },
    filterParts: function (item: any, search: string, itemText: string): boolean {
      const n = item.name.toLowerCase();
      return n.indexOf(search.toLowerCase()) > -1;
    },
    linkPart: async function () {
      if (!this.partIdToLink) {
        this.errorMessage = 'Please select a part';
      } else {
        try {
          const response = await backend.post('part/link_product', {
            partId: this.partIdToLink,
            productId: this.productId,
          });
          if (response.data == 'success') {
            this.linkingPart = false;
            this.successMessage = 'Part Linked';
            await store.dispatch.product.refresh();
          }
        } catch (err: any) {
          this.errorMessage = 'Error Linking Part: ' + err.message;
        }
      }
    },
    slotNameWithComma: (name: string, index: number, length: number) => {
      if (index < length - 1) {
        return name + ', ';
      }
      return name;
    },
    unlinkPart: async function (partId: number) {
      if (confirm('Really unlink part?')) {
        try {
          const response = await backend.post('part/unlink_product', {
            partId,
            productId: this.productId,
          });
          if (response.data == 'success') {
            this.successMessage = 'Part Unlinked';
            await store.dispatch.product.refresh();
          }
        } catch (err: any) {
          this.errorMessage = 'Error Unlinking Part: ' + err.message;
        }
      }
    },
  },
  props: {
    loading: Boolean,
    parts: Array,
    productId: Number,
  },
});
</script>
