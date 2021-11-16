<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/job/JobDashboardTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { AssetInterface } from '@/store/interfaces/Asset';
import AssetFile, { AssetFileInterface } from '@/store/interfaces/AssetFile';
import backend from '@/services/3xrCom';
import { FILE_TYPE } from '@/store/interfaces/types/FileType';
import { mapState } from 'vuex';
import { JobInterface } from '@/store/interfaces/Job';
import store from '@/store/index';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import { TimeFormat } from '@/helpers';
import XrImg from '@/components/image/XrImg.vue';
import x from '@/services/x';
import { FileTypeEnum } from '3xr_types/enums';

export default Vue.extend({
  name: 'job-dashboard-table',
  components: {
    SpinnerButton,
    XrImg,
  },
  computed: {
    isAdmin: () => store.getters.user.isAdmin,
    isArtist: () => store.getters.user.isArtist,
    isClient: () => store.getters.user.isClient,
    isStudioAdmin: () => store.getters.user.isStudioAdmin,
    filterArtist: {
      get: function (): number {
        return this.filterJobs.artistUserId;
      },
      set: function (artistUserId: number): void {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setArtistUserId(artistUserId).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterBrand: {
      get: function (): number {
        return this.filterJobs.brandId;
      },
      set: function (brandId: number): void {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setBrandId(brandId).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterClass: {
      get: function (): number {
        return this.filterJobs.classId;
      },
      set: function (classId: number): void {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setClassId(classId).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterClient: {
      get: function (): number {
        return this.filterJobs.clientId;
      },
      set: async function (clientId: number): Promise<void> {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        await this.loadPicklistsForClient(clientId);
        await store.dispatch.filterJobs.setClientId(clientId);
        this.loadingLocal = false;
      },
    },
    filterDateDueAfter: {
      get: function (): string {
        return this.filterJobs.dateDueAfter;
      },
      set: function (dateDueAfter: string): void {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setDateDueAfter(dateDueAfter).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterDateDueBefore: {
      get: function (): string {
        return this.filterJobs.dateDueBefore;
      },
      set: function (dateDueBefore: string): void {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setDateDueBefore(dateDueBefore).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterSearchString: {
      get: function (): string {
        return this.filterJobs.searchString;
      },
      set: function (searchString: string): void {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setSearchString(searchString).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterProject: {
      get: function (): number[] {
        return this.filterJobs.projectIds;
      },
      set: function (projectIds: number[] | number): void {
        if (typeof projectIds == 'number') {
          projectIds = [projectIds];
        }
        if (projectIds.findIndex((e) => e == 0) == projectIds.length - 1) {
          // Remove other selections if "All" was the last item selected.
          projectIds = [0];
        } else {
          // Remove "All" if it is in the list and not the last item selected.
          projectIds = projectIds.filter((e) => e != 0);
        }
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setProjectIds(projectIds).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterStudio: {
      get: function (): number {
        return this.filterJobs.studioId;
      },
      set: async function (studioId: number): Promise<void> {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        await this.loadPicklistsForStudio(studioId);
        await store.dispatch.filterJobs.setStudioId(studioId);
        this.loadingLocal = false;
      },
    },
    filterStatus: {
      get: function (): number[] {
        // the the prop this.statusFilterId is set, use that and disable the filter
        // This is for the "QA Review" page, where either Client QA or 3XR QA is fixed
        return this.statusFilterId ? [this.statusFilterId] : this.filterJobs.statusIds;
      },
      set: function (statusIds: number[] | number): void {
        if (typeof statusIds == 'number') {
          // Convert to an array if there is only one number (this happens when the X to clear all filters is checked)
          statusIds = [statusIds];
        }
        if (statusIds.findIndex((e) => e == 0) == statusIds.length - 1) {
          // Remove other selections if "All" was the last item selected.
          statusIds = [0];
        } else {
          // Remove "All" if it is in the list and not the last item selected.
          statusIds = statusIds.filter((e) => e != 0);
        }
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setStatusIds(statusIds).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    filterSubmissionCount: {
      get: function (): number {
        return this.filterJobs.submissionCount;
      },
      set: function (submissionCount: number): void {
        this.loadingLocal = true;
        this.selectedForDownload = [];
        store.dispatch.filterJobs.setSubmissionCount(submissionCount).then((result: any) => {
          this.loadingLocal = false;
        });
      },
    },
    glbDownloadCount(): number {
      if (this.selectedForDownload.length > 0) {
        const fileCount = this.selectedForDownload.reduce((total: number, job: JobInterface) => {
          const glb_count = job.product.asset.files.filter((file: AssetFileInterface) => {
            return file.typeId == FileTypeEnum.MODEL_GLB;
          });
          total += glb_count.length;
          return total;
        }, 0);
        return fileCount;
      }
      return 0;
    },
    glbDownloadText(): string {
      if (this.glbDownloadCount > 0) {
        return 'Download ' + this.glbDownloadCount + ' GLB' + (this.glbDownloadCount > 1 ? 's' : '');
      }
      return 'Download GLBs';
    },
    usdzDownloadCount(): number {
      if (this.selectedForDownload.length > 0) {
        const fileCount = this.selectedForDownload.reduce((total: number, job: JobInterface) => {
          const usdz_count = job.product.asset.files.filter((file: AssetFileInterface) => {
            return file.typeId == FileTypeEnum.MODEL_USDZ;
          });
          total += usdz_count.length;
          return total;
        }, 0);
        return fileCount;
      }
      return 0;
    },
    usdzDownloadText(): string {
      if (this.usdzDownloadCount > 0) {
        return 'Download ' + this.usdzDownloadCount + ' USDZ' + (this.usdzDownloadCount > 1 ? 's' : '');
      }
      return 'Download USDZs';
    },
    cbzipDownloadCount(): number {
      if (this.selectedForDownload.length > 0) {
        const fileCount = this.selectedForDownload.reduce((total: number, job: JobInterface) => {
          const zip_count = job.product.asset.files.filter((file: AssetFileInterface) => {
            return file.typeId == FileTypeEnum.CRATE_AND_BARREL_ZIP;
          });
          total += zip_count.length;
          return total;
        }, 0);
        return fileCount;
      }
      return 0;
    },
    cbzipDownloadText(): string {
      if (this.cbzipDownloadCount > 0) {
        return 'Download ' + this.cbzipDownloadCount + ' Zip' + (this.cbzipDownloadCount > 1 ? 's' : '');
      }
      return 'Download Zips';
    },
    headers() {
      if (this.showDownloads) {
        return [
          {
            align: 'center',
            filterable: false,
            sortable: false,
            text: 'Thumbnail',
            value: 'thumbnail',
          },
          { text: 'Product Name', align: 'left', value: 'product.name' },
          {
            align: 'center',
            filterable: false,
            sortable: false,
            text: 'Downloads',
            value: 'product.asset',
          },
          {
            filterable: false,
            text: this.dateSearchIsForApprovals ? 'Approved At' : 'Deadline',
            align: 'center',
            value: this.dateSearchIsForApprovals ? 'updatedAt' : 'dateDue',
          },
        ];
      } else {
        return [
          {
            align: 'center',
            filterable: false,
            sortable: false,
            text: 'Thumbnail',
            value: 'thumbnail',
          },
          { text: 'Product Name', align: 'left', value: 'product.name' },
          {
            align: 'center',
            filterable: false,
            text: 'Status',
            value: 'status.name',
          },
          { filterable: false, text: 'Deadline', align: 'center', value: 'dateDue' },
        ];
      }
    },
    ...mapState({
      artists: (state: any) => state.artists.artists,
      clients: (state: any) => state.clients.clients,
      clientBrands: (state: any) => state.clientBrands.clientBrands,
      clientClasses: (state: any) => state.clientClasses.clientClasses,
      filterJobs: (state: any) => state.filterJobs.filterJobs,
      jobs: (state: any) => state.jobs.jobs,
      pickList: (state: any) => state.pickList.pickList,
      product: (state: any) => state.product.product,
      projects: (state: any) => state.projects.projects,
      studios: (state: any) => state.studios.studios,
      user: (state: any) => state.user.user,
    }),
  },
  watch: {
    isArtist(newValue: boolean, oldValue: boolean) {
      if (newValue) {
        store.dispatch.filterJobs.setArtistUserId(store.state.user.user.id);
      }
    },
    isClient(newValue: boolean, oldValue: boolean) {
      if (newValue) {
        store.dispatch.filterJobs.setClientId(store.state.client.client.id);
      }
    },
    showFilterIndex(newValue: number | undefined, oldValue: number | null | undefined) {
      if (newValue === 0 && !this.picklistsLoaded) {
        this.picklistsLoaded = true;
        this.loadPicklists();
      }
    },
  },
  created: async function () {
    if (Object.keys(this.$router.currentRoute.query).length > 0) {
      // show the filter if there are any url params
      this.showFilterIndex = 0;

      // Update the filter with the query params and fetch the data once
    }
    if (this.dateSearchIsForApprovals) {
      this.filterJobs.dateSearchIsForApprovals = this.dateSearchIsForApprovals;
    }
  },
  data: () => ({
    calenderDueDateAfter: false,
    calenderDueDateBefore: false,
    cbzipErrorMessage: '',
    cbzipZipping: false,
    csvErrorMessage: '',
    csvLoading: false,
    footerProps: {
      'items-per-page-options': [15, 20, 35, 50, -1],
    },
    glbErrorMessage: '',
    glbZipping: false,
    initialItemsPerPage: 15,
    loadingLocal: false,
    picklistsLoaded: false,
    search: '',
    selectedForDownload: [],
    showFilterIndex: null as unknown as number,
    submissionCount: [
      { id: -1, name: 'Any' },
      { id: 0, name: '0' },
      { id: 1, name: '1' },
      { id: 2, name: '2' },
      { id: 3, name: '3' },
      { id: 4, name: '4' },
      { id: 5, name: '5' },
      { id: 6, name: '6' },
      { id: 7, name: '7' },
      { id: 8, name: '8' },
      { id: 9, name: '9' },
      { id: 10, name: '10+' },
    ],
    usdzErrorMessage: '',
    usdzZipping: false,
  }),
  methods: {
    downloadCSV(): void {
      this.csvLoading = true;
      this.csvErrorMessage = '';
      backend
        .post('/job/job_search', {
          ...this.filterJobs,
          ...{ csv: true },
        })
        .then((result) => {
          this.csvLoading = false;
          const url = window.URL.createObjectURL(new Blob([result.data]));
          const link = document.createElement('a');
          link.href = url;
          const filename = '3xr_jobs_data_' + TimeFormat.dateStringYYYYMMDD_HHMMSS(new Date()) + '.csv';
          link.setAttribute('download', filename);
          document.body.appendChild(link);
          link.click();
        })
        .catch((err: Error) => {
          this.csvLoading = false;
          this.csvErrorMessage = 'Unable to prepare CSV';
        });
    },
    async downloadGLBs(): Promise<void> {
      this.glbZipping = true;
      const jobUids = this.selectedForDownload.map((item: JobInterface) => {
        return item.uid;
      });
      const zips_download_url = await x.post('download_zips', { jobUids, fileType: FILE_TYPE.MODEL_GLB });
      if (zips_download_url.data.error) {
        this.glbErrorMessage = zips_download_url.data.error;
      } else {
        const link = document.createElement('a');
        link.href = zips_download_url.data;
        document.body.appendChild(link);
        link.click();
        this.glbZipping = false;
      }
    },
    async downloadUSDZs(): Promise<void> {
      this.usdzZipping = true;
      const jobUids = this.selectedForDownload.map((item: JobInterface) => {
        return item.uid;
      });
      const zips_download_url = await x.post('download_zips', { jobUids, fileType: FILE_TYPE.MODEL_USDZ });
      if (zips_download_url.data.error) {
        this.usdzErrorMessage = zips_download_url.data.error;
      } else {
        const link = document.createElement('a');
        link.href = zips_download_url.data;
        document.body.appendChild(link);
        link.click();
        this.usdzZipping = false;
      }
    },
    async downloadCbZips(): Promise<void> {
      this.cbzipZipping = true;
      const jobUids = this.selectedForDownload.map((item: JobInterface) => {
        return item.uid;
      });
      const zips_download_url = await x.post('download_zips', { jobUids, fileType: FILE_TYPE.CRATE_AND_BARREL_ZIP });
      if (zips_download_url.data.error) {
        this.cbzipErrorMessage = zips_download_url.data.error;
      } else {
        const link = document.createElement('a');
        link.href = zips_download_url.data;
        document.body.appendChild(link);
        link.click();
        this.cbzipZipping = false;
      }
    },
    filterIncludesAndExcludes(value: string, search: string | null, item: any): boolean {
      if (value === null || search === null || typeof value != 'string' || search.length <= 0) {
        // Quick return when nothing is being searched for
        return false;
      }
      // Mulitple words can be searched and each can start with ! for exclusion
      let searchWords = search.split(' ');
      let allWordsPass = true;
      searchWords.forEach((searchWord: string) => {
        let exclude = searchWord[0] == '-';
        if (exclude) {
          searchWord = searchWord.substring(1);
        }
        let matchFound = value.toLocaleLowerCase().indexOf(searchWord.toLocaleLowerCase()) !== -1;
        if (exclude && matchFound) {
          allWordsPass = false;
        } else if (!exclude && !matchFound) {
          allWordsPass = false;
        }
      });
      return allWordsPass;
    },
    getDownloadLinks(asset: AssetInterface): any[] {
      return asset.files
        .filter((file: AssetFile) => {
          return [FILE_TYPE.MODEL_GLB, FILE_TYPE.MODEL_USDZ, FILE_TYPE.CRATE_AND_BARREL_ZIP].includes(file.typeId);
        })
        .sort((e1: any, e2: any) => {
          if (e1.extension > e2.extension) {
            return 1;
          } else {
            return 0;
          }
        })
        .map((file) => {
          return {
            name: file.extension,
            url: file.getUrl(asset.uid),
          };
        });
    },
    async loadPicklists(): Promise<void> {
      if (this.isAdmin) {
        // TODO: perform this filter on the backend
        await store.dispatch.clients.loadPicklistForAdmin();
        await store.dispatch.studios.loadAllForAdmin();
      } else {
        await store.dispatch.clients.loadForUser(store.state.user.user.id);
        if (this.clients.length == 1) {
          store.commit.filterJobs.SET_CLIENT_ID(this.clients[0].id);
        }
        await store.dispatch.studios.loadForUser(store.state.user.user.id);
        if (this.studios.length == 1) {
          store.commit.filterJobs.SET_STUDIO_ID(this.studios[0].id);
        }
      }
      await store.dispatch.projects.loadPicklist();
      if (this.filterJobs.clientId) {
        await this.loadPicklistsForClient(this.filterJobs.clientId);
      }
      if (this.filterJobs.studioId) {
        await this.loadPicklistsForStudio(this.filterJobs.studioId);
      }
    },
    async loadPicklistsForClient(clientId: number | null): Promise<void> {
      if (clientId) {
        await store.dispatch.clientBrands.loadForClient(clientId);
        await store.dispatch.clientClasses.loadForClient(clientId);
      } else {
        store.commit.clientBrands.CLEAR();
        store.commit.clientClasses.CLEAR();
      }
    },
    async loadPicklistsForStudio(studioId: number | null): Promise<void> {
      if (studioId) {
        await store.dispatch.artists.loadForStudio(studioId);
      } else {
        store.commit.artists.CLEAR();
      }
    },
    optionsUpdate(options: any): void {
      store.commit.filterJobs.SET_RESULTS_PER_PAGE(options.itemsPerPage);
    },
    showPreviewOrReroute(job: JobInterface): void {
      if (this.showDownloads) {
        // For the complete items tab (with downloads), don't show the preview and just link to the final asset page
        this.$router.push({
          name: 'asset-details',
          params: { uid: job.product.asset.uid },
        });
      } else {
        // Still showing the preview pane on non-complete pages, but may change to go to the product details page
        this.showPreview(job.uid);
      }
    },
  },
  props: {
    dateSearchIsForApprovals: Boolean,
    loading: Boolean,
    projectUid: String,
    showDownloads: Boolean,
    showPreview: Function,
    title: String,
    statusFilterId: Number,
  },
});
</script>

<style lang="scss" scoped>
.job-thumbnail {
  cursor: pointer;
}
.status-name {
  margin-bottom: -10px;
}
.filter {
  padding-right: 20px;
  margin-top: 10px;
  margin-bottom: -20px;
}
.reduce-margin-top {
  margin-top: -20px;
}
.reduce-margin-sides {
  margin-left: -15px;
  margin-right: -15px;
}
.apply-btn {
  padding-top: 10px;
}
.v-expansion-panel-header {
  height: 24px !important;
  min-height: 24px !important;
}
.v-expansion-panel--active {
  min-height: 24px !important;
}
.cal {
  padding-top: 15px;
  padding-right: 15px;
}
.product-name {
  height: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
}
.product-name p {
  margin: 0;
}
.clear-x {
  margin-top: 25px;
  margin-left: -10px;
}
</style>
