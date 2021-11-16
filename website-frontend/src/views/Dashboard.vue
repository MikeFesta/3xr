<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./Dashboard.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import store from '@/store/index';
import backend from '@/services/3xrCom';
import { mapState } from 'vuex';
import BarGraph from '@/components/charts/BarGraph.vue';
import DashboardTabs from '@/components/navigation/DashboardTabs.vue';
import LineGraph from '@/components/charts/LineGraph.vue';
import { JOB_STATUS_TYPE } from '@/store/interfaces/types/JobStatusType';
import { TimeFormat } from '@/helpers';
import { USER_ROLE_NAME } from '@/store/interfaces/types/UserRoleType';

export default Vue.extend({
  name: 'Dashboard',
  metaInfo: {
    title: 'Dashboard | 3XR',
  },
  components: {
    BarGraph,
    DashboardTabs,
    LineGraph,
  },
  computed: {
    role: () => store.getters.user.role,
    isAdmin: () => store.getters.user.isAdmin,
    isArtist: () => store.getters.user.isArtist,
    isClient: () => store.getters.user.isClient,
    isQa: () => store.getters.user.isQa,
    isStudioAdmin: () => store.getters.user.isStudioAdmin,
    loading: function (): boolean {
      return this.loadingDeadlineRisk || this.loadingStatusCount || this.loadingStatusSnapshot;
    },
    ...mapState({
      filterJobs: (state: any) => state.filterJobs.filterJobs,
      theme: (state: any) => state.theme.theme,
      userSettings: (state: any) => state.userSettings.userSettings,
    }),
  },
  created() {
    this.getGraphData();
  },
  data: function () {
    let labelsForSnapshotData = [];
    for (let i = 6; i >= 0; i--) {
      // i is number of days to subtract, as the graph starts 6 days out
      let labelTime = new Date().setDate(new Date().getDate() - i);
      let labelDate = new Date(labelTime);
      labelsForSnapshotData.push(labelDate.getMonth() + 1 + '/' + labelDate.getDate());
    }
    return {
      barGraphOptions: {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
          position: 'bottom',
        },
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
      deadlineRiskData: {
        labels: [
          'On Track (models on schedule to hit deadline)',
          'At Risk (deadline is three days out from today)',
          'Due Today (client expects model delivery today)',
          'Past Due (deadline has been missed)',
        ],
        datasets: [
          {
            label: 'Assigned', // 2
            backgroundColor: this.$store.state.theme.theme.color.blue,
            data: [0, 0, 0, 0],
          },
          {
            label: 'In Progress', // 3
            backgroundColor: this.$store.state.theme.theme.color.orange,
            data: [0, 0, 0, 0],
          },
          {
            label: 'Modeler QA', // 4
            backgroundColor: this.$store.state.theme.theme.color.lightPurple,
            data: [0, 0, 0, 0],
          },
          {
            label: 'Technical QA', // 5
            backgroundColor: this.$store.state.theme.theme.color.pink,
            data: [0, 0, 0, 0],
          },
          {
            label: 'Revision Needed', // 6
            backgroundColor: this.$store.state.theme.theme.color.red,
            data: [0, 0, 0, 0],
          },
          {
            label: 'In Rework', // 7
            backgroundColor: this.$store.state.theme.theme.color.lightBlue,
            data: [0, 0, 0, 0],
          },
          {
            label: 'Client QA', // 8
            backgroundColor: this.$store.state.theme.theme.color.lightGreen,
            data: [0, 0, 0, 0],
          },
        ],
      },
      dialog: false,
      lineGraphOptions: {
        legend: {
          position: 'bottom',
        },
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          xAxes: [
            {
              stacked: true,
            },
          ],
          yAxes: [
            {
              stacked: true,
            },
          ],
        },
      },
      loadingDeadlineRisk: false,
      loadingStatusCount: false,
      loadingStatusSnapshot: false,
      statusSnapshotData: {
        labels: labelsForSnapshotData,
        datasets: [
          {
            label: 'Assigned', // 2
            backgroundColor: this.$store.state.theme.theme.color.blue,
            data: [0],
          },
          {
            label: 'In Progress', // 3
            backgroundColor: this.$store.state.theme.theme.color.orange,
            data: [0],
          },
          {
            label: 'Modeler QA', // 4
            backgroundColor: this.$store.state.theme.theme.color.lightPurple,
            data: [0],
          },
          {
            label: 'Technical QA', // 5
            backgroundColor: this.$store.state.theme.theme.color.pink,
            data: [0],
          },
          {
            label: 'Revision Needed', // 6
            backgroundColor: this.$store.state.theme.theme.color.red,
            data: [0],
          },
          {
            label: 'In Rework', // 7
            backgroundColor: this.$store.state.theme.theme.color.lightBlue,
            data: [0],
          },
          {
            label: 'Client QA', // 8
            backgroundColor: this.$store.state.theme.theme.color.lightGreen,
            data: [0],
          },
        ],
      },
      statusWaterfallData: {
        labels: [
          'Unassigned', // 1
          'Assigned', // 2
          'In Progress', // 3
          'Modeler QA', // 4
          'Technical QA', // 5
          'Revision Needed', // 6
          'In Rework', // 7
          'Client QA', // 8
          'Complete', // 9
        ],
        datasets: [
          {
            label: 'Total Prior',
            backgroundColor: this.$store.state.theme.theme.color.white,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
          {
            label: 'Jobs',
            backgroundColor: this.$store.state.theme.theme.color.blue,
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          },
        ],
      },
    };
  },
  methods: {
    clearGraphData: function (): void {
      // If the user role changes, we need to clear out the old graph data
      for (let i = 0; i < this.deadlineRiskData.datasets.length; i++) {
        this.deadlineRiskData.datasets[i].data = [0, 0, 0, 0];
      }
      for (let i = 0; i < this.statusSnapshotData.datasets.length; i++) {
        this.statusSnapshotData.datasets[i].data = [0];
      }
      // quick hack to restore labels if there were removed for QA, clean this up when refactoring into components
      this.statusWaterfallData.labels = [
        'Unassigned', // 1
        'Assigned', // 2
        'In Progress', // 3
        'Modeler QA', // 4
        'Technical QA', // 5
        'Revision Needed', // 6
        'In Rework', // 7
        'Client QA', // 8
        'Complete', // 9
      ];
      this.statusWaterfallData.datasets[0].data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      this.statusWaterfallData.datasets[1].data = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    },
    filterDatasetsByLabels(enabledLabels: string[], data: any) {
      const enabledIdx: number[] = data.labels.reduce((acc: number[], curr: string, idx: number) => {
        if (enabledLabels.includes(curr)) {
          acc.push(idx);
        }
        return acc;
      }, []);
      const newDatasets = data.datasets.map((dataset: any) => {
        return {
          ...dataset,
          data: dataset.data.filter((data: number, idx: number) => {
            if (enabledIdx.includes(idx)) {
              return true;
            }
          }),
        };
      });
      return { datasets: newDatasets, labels: enabledLabels };
    },
    filterForAdmin() {
      const enabledLabels = [
        'Unassigned',
        'Assigned',
        'In Progress',
        'Modeler QA',
        'Technical QA',
        'Revision Needed',
        'In Rework',
        'Client QA',
      ];
      const newStatusData = this.filterDatasetsByLabels(enabledLabels, this.statusWaterfallData);
      this.statusWaterfallData = newStatusData;
    },
    filterForArtist() {
      const enabledLabels = [
        'Assigned',
        'In Progress',
        'Modeler QA',
        'Technical QA',
        'Revision Needed',
        'In Rework',
        'Client QA',
      ];
      const newStatusData = this.filterDatasetsByLabels(enabledLabels, this.statusWaterfallData);
      this.statusWaterfallData = newStatusData;
    },
    filterForQa() {
      const enabledLabels = ['Modeler QA', 'Technical QA', 'Revision Needed', 'In Rework', 'Client QA'];
      const newStatusData = this.filterDatasetsByLabels(enabledLabels, this.statusWaterfallData);
      this.statusWaterfallData = newStatusData;
    },
    filterForClient() {
      const enabledLabels = ['In Progress', 'Modeler QA', 'Technical QA', 'Revision Needed', 'In Rework', 'Client QA'];
      const newStatusData = this.filterDatasetsByLabels(enabledLabels, this.statusWaterfallData);
      this.statusWaterfallData = newStatusData;
    },
    getGraphData: async function () {
      // TODO: Move each of these graphs into their own component
      if (this.isAdmin || this.isArtist || this.isStudioAdmin) {
        // Status Snapshots are just for admins, and Deadline Risk is for admins and artists
        this.loadingDeadlineRisk = true;
        const results = await backend.post('job/deadline_status');
        for (let i = 0; i < results.data.length; i++) {
          for (let j = 0; j < results.data[i].length; j++) {
            this.deadlineRiskData.datasets[results.data[i][j].statusId - 2].data[i] += parseInt(
              results.data[i][j].statusCount,
            );
          }
        }
        this.loadingDeadlineRisk = false;
        if (this.isAdmin) {
          this.loadingStatusSnapshot = true;
          const statusSnapshots = await backend.post('job/status_snapshot', null);
          for (let i = 0; i < statusSnapshots.data.length; i++) {
            // The Status ID starts at 2 (Assigned), so subtract 2 from each value to get the right index
            const statusIndex = statusSnapshots.data[i].jobStatusId - 2;
            if (statusIndex >= 0 && statusIndex < 7) {
              // Exclude Unassigned, Complete, Canceled from display
              if (this.statusSnapshotData.datasets[statusIndex].data.length <= statusSnapshots.data[i].dayIndex) {
                this.statusSnapshotData.datasets[statusIndex].data.push(parseInt(statusSnapshots.data[i].jobCount));
              } else {
                this.statusSnapshotData.datasets[statusIndex].data[statusSnapshots.data[i].dayIndex] += parseInt(
                  statusSnapshots.data[i].jobCount,
                );
              }
            }
          }
          this.loadingStatusSnapshot = false;
        }
      }

      // Load the status count for all users, results will be filtered on the backend based on user.primaryRoleId
      this.loadingStatusCount = true;
      const statusResults = await backend.post('job/status_count', null);
      for (let i = 0; i < statusResults.data.length; i++) {
        let column = -1;
        switch (statusResults.data[i].statusId) {
          case JOB_STATUS_TYPE.UNASSIGNED:
            column = 0;
            break;
          case JOB_STATUS_TYPE.ASSIGNED:
            column = 1;
            break;
          case JOB_STATUS_TYPE.IN_PROGRESS:
            column = 2;
            break;
          case JOB_STATUS_TYPE.SELF_QA:
            column = 3;
            break;
          case JOB_STATUS_TYPE.TECHNICAL_QA:
            column = 4;
            break;
          case JOB_STATUS_TYPE.REVISION_NEEDED:
            column = 5;
            break;
          case JOB_STATUS_TYPE.IN_REWORK:
            column = 6;
            break;
          case JOB_STATUS_TYPE.CLIENT_QA:
            column = 7;
            break;
          case JOB_STATUS_TYPE.COMPLETE:
            column = 8;
            break;
        }
        if (column >= 0) {
          this.statusWaterfallData.datasets[1].data[column] += parseInt(statusResults.data[i].statusCount);
        }
      }
      let total = 0;
      // Only start counting "total prior" at the first column to be shown
      let dataStart = 0; // Unassigned
      if (this.role === USER_ROLE_NAME.ARTIST) {
        dataStart = 1; // Assigned
      } else if (this.role === USER_ROLE_NAME.QA) {
        dataStart = 4; // Modeler QA
      } else if (this.role === USER_ROLE_NAME.CLIENT) {
        dataStart = 3; // In Progress
      }
      for (let i = 0; i < this.statusWaterfallData.datasets[1].data.length; i++) {
        if (i < dataStart) {
          total = 0;
        }
        this.statusWaterfallData.datasets[0].data[i] = total;
        total += this.statusWaterfallData.datasets[1].data[i];
      }
      this.loadingStatusCount = false;
      if (this.role === USER_ROLE_NAME.ADMIN) {
        this.filterForAdmin();
      } else if (this.role === USER_ROLE_NAME.ARTIST) {
        this.filterForArtist();
      } else if (this.role === USER_ROLE_NAME.QA) {
        this.filterForQa();
      } else if (this.role === USER_ROLE_NAME.STUDIO_ADMIN) {
        this.filterForAdmin();
      } else {
        this.filterForClient();
      }
    },
    showJobsByRiskFilter: function (point: any, events: Array<any>) {
      if (events.length == 0) {
        return;
      }
      const riskIndex = events[0]._index;
      let query = {};
      switch (riskIndex) {
        case 0:
          // On Track - more than 3 days out
          query = { dateDueAfter: TimeFormat.dateDaysFromNowYYYYMMDD(3) };
          break;
        case 1:
          // At Risk (deadline within 3 days of today)
          query = {
            dateDueAfter: TimeFormat.dateDaysFromNowYYYYMMDD(1),
            dateDueBefore: TimeFormat.dateDaysFromNowYYYYMMDD(3),
          };
          break;
        case 2:
          // Due Today
          query = {
            dateDueAfter: TimeFormat.dateDaysFromNowYYYYMMDD(0),
            dateDueBefore: TimeFormat.dateDaysFromNowYYYYMMDD(0),
          };
          break;
        case 3:
          // Past Due
          query = { dateDueBefore: TimeFormat.dateDaysFromNowYYYYMMDD(0) };
          break;
      }
      this.$router.push({
        path: '/jobs',
        query: query,
      });
    },
    showJobsByStatusFilter: function (point: any, event: Array<any>) {
      let statusId = event[0]._index;
      // The index starts in different places based on the user role
      switch (this.role) {
        case USER_ROLE_NAME.ARTIST:
          statusId += 2; // starts on (2) Assigned
          break;
        case USER_ROLE_NAME.CLIENT:
          statusId += 3; // starts on (3) In Progress
          break;
        case USER_ROLE_NAME.QA:
          statusId += 4; // starts on (4) Modeler QA
          break;
        default:
          statusId += 1; // starts on (1) Unassigned
          break;
      }
      this.$router.push({
        path: '/jobs',
        query: { statusId: statusId },
      });
    },
  },
  watch: {
    '$store.getters.user.role': function (): void {
      // bug fix - only reload the data if it is not being loaded
      if (!this.loading) {
        this.clearGraphData();
        this.getGraphData();
      }
    },
  },
});
</script>
