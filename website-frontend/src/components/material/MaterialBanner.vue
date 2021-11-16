<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/material/MaterialBanner.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import xBlob from '@/services/xBlob';
import { mapState } from 'vuex';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import XrImg from '@/components/image/XrImg.vue';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'material-banner',
  components: {
    RabbitButton,
    ...vuetifyComponents,
    XrImg,
  },
  computed: {
    ...mapState({
      material: (state: any) => state.material.material,
    }),
  },
  data: () => ({
    downloading: false,
    errorMessage: '',
  }),
  methods: {
    downloadMaterial: function() {
      this.downloading = true;
      xBlob
        .get(this.material.blendDownloadUrl)
        .then(result => {
          this.downloading = false;
          const url = window.URL.createObjectURL(new Blob([result.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.material.blendName + '.blend');
          document.body.appendChild(link);
          link.click();
        })
        .catch(err => {
          this.downloading = false;
          this.errorMessage = 'Unable to Download';
        });
    },
  },
  props: {
    loading: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.color-swatch {
  display: inline-block;
  height: 90px;
  width: 90px;
  border-radius: 5px;
}
.material-banner {
  display: flex;
  margin: 10px auto;
}
.material-thumbnail {
  width: 100%;
}
.material-details {
  display: flex;
  flex-grow: 1;
  flex-flow: column wrap;
}
.material-title {
  background-color: $color-light-blue;
  color: $color-white;
  font-size: 200%;
  padding: 2px 8px;
}
.material-additional-details {
  padding: 8px;
  flex-grow: 1;
}
.material-download {
  height: 40px;
}
</style>
