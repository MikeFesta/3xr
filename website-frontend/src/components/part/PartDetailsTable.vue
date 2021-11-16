<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/part/PartDetailsTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import { mapState } from 'vuex';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import ToDo from '@/components/misc/ToDo.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'part-details-table',
  components: {
    RabbitButton,
    ToDo,
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      part: (state: any) => state.part.part,
    }),
  },
  data: () => ({
    addingSlot: false,
    errorMessage: '',
    newSlotName: '',
    successMessage: '',
  }),
  methods: {
    addSlot: async function() {
      if (!this.newSlotName) {
        this.errorMessage = 'Name cannot be blank';
      } else {
        try {
          const response = await backend.post('part/add_slot',
            {
              partId: this.part.id,
              name: this.newSlotName
            }
          );
          if (response.data == 'success') {
            this.addingSlot = false;
            this.successMessage = 'Slot Added';
            await store.dispatch.part.refresh();
          }
        } catch (err: any) {
          this.errorMessage = 'Error Adding Part: ' + err.message;
        }
      }
    },
    clearMessages: function() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    renderPartData: function() {
      return {
        uid: this.part.uid,
        blendName: this.part.blendName,
      };
    },
    removeSlot: async function(id: number) {
      if (confirm('Do you really want to remove this material slot?')) {
        try {
          const response = await backend.post('part/remove_slot',
            {
              id,
              partId: this.part.id, // extra validation
            }
          );
          if (response.data == 'success') {
            await store.dispatch.part.refresh();
          }
        } catch (err: any) {
          this.errorMessage = 'Error Removing Slot: ' + err.message;
        }
      }
    }
  },
  props: {
    loading: Boolean,
  },
});
</script>
