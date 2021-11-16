<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/product/ProductLinkedMaterials.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import { mapState } from 'vuex';
import store from '@/store/index';
import { vuetifyComponents } from '@/plugins/vuetify';
import PartSlot from '@/store/interfaces/PartSlot';

export default Vue.extend({
  name: 'product-linked-materials',
  components: {
    ...vuetifyComponents,
  },
  computed: {
    availableSlots: function (): PartSlot[] {
      //@ts-ignore
      return this.slots.filter((slot) => {
        let linked = false;
        this.materials.forEach((material) => {
          //@ts-ignore
          if (material.productMaterial.slotName == slot) {
            linked = true;
          }
        });
        return !linked;
      });
    },
    ...mapState({
      allMaterials: (state: any) => state.materials.materials,
    }),
  },
  created: async function () {
    // Populate dropdowns
    store.dispatch.materials.loadAllForAdmin();
  },
  data: () => ({
    linkingMaterial: false,
    errorMessage: '',
    materialIdToLink: 0,
    newSlotName: '',
    successMessage: '',
  }),
  methods: {
    clearMessages: function () {
      this.errorMessage = '';
      this.successMessage = '';
    },
    filterByName: function (item: any, search: string, itemText: string): boolean {
      const n = item.name.toLowerCase();
      return n.indexOf(search.toLowerCase()) > -1;
    },
    linkMaterial: async function () {
      if (!this.materialIdToLink) {
        this.errorMessage = 'Please select a material';
      } else if (!this.newSlotName) {
        this.errorMessage = 'Slot name cannot be blank';
      } else {
        try {
          const response = await backend.post('material/link_product', {
            materialId: this.materialIdToLink,
            productId: this.productId,
            slotName: this.newSlotName,
          });
          if (response.data == 'success') {
            this.linkingMaterial = false;
            this.successMessage = 'Material Linked';
            await store.dispatch.product.refresh();
          }
        } catch (err: any) {
          this.errorMessage = 'Error Linking Material: ' + err.message;
        }
      }
    },
    unlinkMaterial: async function (materialId: number) {
      if (confirm('Really unlink material?')) {
        try {
          const response = await backend.post('material/unlink_product', {
            materialId,
            productId: this.productId,
          });
          if (response.data == 'success') {
            this.successMessage = 'Material Unlinked';
            await store.dispatch.product.refresh();
          }
        } catch (err: any) {
          this.errorMessage = 'Error Unlinking Material: ' + err.message;
        }
      }
    },
  },
  props: {
    loading: Boolean,
    materials: Array,
    productId: Number,
    slots: Array,
  },
});
</script>
