<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/artist/resources/BlenderAddOn.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';

export default Vue.extend({
  name: 'blender-add-on',
  metaInfo: {
    title: 'Blender Add-On | 3XR',
  },
  computed: {
    downloadLink(): string {
      return 'https://cdn.3xr.com/blender/xrs.' + this.currentVersion + '.zip';
    },
  },
  created() {
    backend
      .get('blender/add-on-version')
      .then((response) => {
        this.currentVersion = response.data.version;
        this.blenderVersion = response.data.blenderVersion;
      })
      .catch((err) => {
        this.currentVersion = '21.1.14';
      });
  },
  data() {
    return {
      blenderVersion: '2.81.0',
      currentVersion: '21.1.14', // Note: source of truth is the backend, this is a placeholder
      e6: 1,
    };
  },
});
</script>

<style lang="scss" scoped>
ol.instructions li {
  padding-bottom: 20px;
}
.wrap-whitespace {
  background-color: #ff0;
  white-space: break-spaces;
}
</style>
