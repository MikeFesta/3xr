<!-- SPDX-License-Identifier: Apache-2.0 -->
<script lang="ts">
import { Line, mixins } from 'vue-chartjs';
const { reactiveProp } = mixins;

export default {
  extends: Line,
  name: 'LineChart',
  mixins: [reactiveProp],
  props: ['options'],
  mounted() {
    //@ts-ignore
    this.renderChart(this.chartData, this.options);
  },
};
</script>
