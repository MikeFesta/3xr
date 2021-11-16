<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/material/MaterialDetailsTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'material-details-table',
  components: {
    RabbitButton,
    ...vuetifyComponents,
  },
  computed: {
    ...mapState({
      material: (state: any) => state.material.material,
    }),
  },
  methods: {
    initMaterialData: function () {
      return {
        blendName: this.material.blendName,
        diffuse: this.material.hexString,
        metallic: this.material.metallicValue,
        // TODO: Normal Strength
        roughness: this.material.roughnessValue,
        // TODO: Scale Value
        uid: this.material.uid,
      };
    },
    renderMaterialData: function () {
      return {
        uid: this.material.uid,
        blendName: this.material.blendName,
        resolution: 256,
      };
    },
  },
  props: {
    loading: Boolean,
  },
});
</script>
