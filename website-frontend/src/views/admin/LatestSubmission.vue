<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/admin/LatestSubmission.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import AdminTabs from '@/components/navigation/AdminTabs.vue';

export default Vue.extend({
  name: 'admin-user-management-new-user',
  metaInfo: {
    title: 'Latest Submission | 3XR',
  },
  components: {
    AdminTabs,
    ...vuetifyComponents,
  },
  mounted: function () {
    this.update();
    this.updateClockSize();
    window.addEventListener('resize', this.updateClockSize);
  },
  data: () => ({
    clockFontSize: 20,
  }),
  methods: {
    update: function () {
      this.updateClock();
      this.updateSubmission();
      setTimeout(this.update, 60000);
    },
    updateSubmission: async function () {
      const { data } = await backend.get('admin/latest_submission');
      // TODO: this could hydrate a assetSubmission model, but just doing this quick for now
      if (data) {
        const render = document.getElementById('render');
        if (render) {
          const url =
            'https://x.3xr.com/x/assets/' +
            data.asset.uid +
            '/submissions/' +
            data.submissionNumber +
            '/' +
            data.asset.name +
            '-2k.png';
          render.style.backgroundImage = "url('" + url + "')";
          const link = document.getElementById('link');
          if (link) {
            //@ts-ignore
            link.href = '/product/review/' + data.asset.product.uid;
          }
        }
      }
    },
    updateClock: function () {
      const clock = document.getElementById('clock');
      if (clock) {
        const d = new Date();
        clock.textContent = ((d.getHours() + 11) % 12) + 1 + ':' + (d.getMinutes() < 10 ? '0' : '') + d.getMinutes();
      }
    },
    updateClockSize: function () {
      const clock = document.getElementById('clock');
      if (clock) {
        for (let x = 0; x < 5; x++) {
          //@ts-ignore
          this.clockFontSize *= 0.9 / (clock.offsetWidth / clock.parentNode.offsetWidth);
          clock.style.fontSize = this.clockFontSize + 'pt';
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.clock {
  display: inline-block;
  font-size: 40pt;
  text-align: center;
  height: 100%;
}
.render {
  background-position: center;
  background-size: cover;
  display: inline-block;
  height: 100%;
  width: 100%;
}
</style>
