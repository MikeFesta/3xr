<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/part/PartBanner.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import xBlob from '@/services/xBlob';
import { mapState } from 'vuex';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import XrImg from '@/components/image/XrImg.vue';
import { vuetifyComponents } from '@/plugins/vuetify';

export default Vue.extend({
  name: 'part-banner',
  components: {
    RabbitButton,
    ...vuetifyComponents,
    XrImg,
  },
  computed: {
    ...mapState({
      part: (state: any) => state.part.part,
    }),
  },
  data: () => ({
    downloading: false,
    errorMessage: '',
  }),
  methods: {
    downloadPart: function() {
      this.downloading = true;
      xBlob
        .get(this.part.blendDownloadUrl)
        .then(result => {
          this.downloading = false;
          const url = window.URL.createObjectURL(new Blob([result.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', this.part.blendName + '.blend');
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
.part-banner {
  display: flex;
  margin: 10px auto;
}
.part-thumbnail {
  width: 100%;
}
.part-details {
  display: flex;
  flex-grow: 1;
  flex-flow: column wrap;
}
.part-title {
  background-color: $color-light-blue;
  color: $color-white;
  font-size: 200%;
  padding: 2px 8px;
}
.part-additional-details {
  padding: 8px;
  flex-grow: 1;
}
.part-download {
  height: 40px;
}
</style>
