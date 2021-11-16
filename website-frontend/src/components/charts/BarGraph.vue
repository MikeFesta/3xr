<!-- SPDX-License-Identifier: Apache-2.0 -->
<script lang="ts">
import Vue from 'vue';
import { Bar, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default Vue.extend({
  extends: Bar,
  name: 'BarChart',
  mixins: [reactiveProp],
  props: {
    onClick: Function,
    options: Object,
    chartData: Object,
  },
  mounted() {
    const options = {
      ...this.options,
      onClick: this.onClick,
    };
    //@ts-ignore (renderChart comes from reactiveProp mixin)
    this.renderChart(this.chartData, options);
  },
});
</script>
