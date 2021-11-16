<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./QrCode.pug">
</template>

<script>
import Vue from 'vue';
import QrcodeVue from 'qrcode.vue';

export default Vue.extend({
  name: 'qr-code',
  components: {
    QrcodeVue,
  },
  computed: {
    url: function () {
      if (this.submissionNumber) {
        // If a submission number is given, it is still in QA
        return 'https://view.3xr.com/' + this.uid + '?s=' + this.submissionNumber;
      } else {
        return 'https://view.3xr.com/' + this.uid;
      }
    },
  },
  props: {
    imgSrc: {
      type: String,
      require: false,
    },
    uid: {
      type: String,
      required: true,
    },
    submissionNumber: {
      type: Number,
      require: false,
    },
    showUrl: {
      type: Boolean,
      require: false,
    },
  },
});
</script>

<style lang="scss" scoped>
.img-full-width {
  width: 100%;
}
</style>
