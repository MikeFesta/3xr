<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/asset/AssetSubmissionDetailsTable.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import { mapState } from 'vuex';
import { ASSET_SUBMISSION_STATUS_TYPE } from '@/store/interfaces/types/AssetSubmissionStatusType';
import backend from '@/services/3xrCom';
import RabbitButton from '@/components/buttons/RabbitButton.vue';
import store from '@/store/index';

export default Vue.extend({
  name: 'asset-submission-details-table',
  components: {
    RabbitButton,
    ...vuetifyComponents
  },
  computed: {
    downloadRootUrl(): string {
      return (
        'https://x.3xr.com/x/assets/' +
        this.assetSubmission.asset.uid +
        '/submissions/' +
        this.assetSubmission.submissionNumber +
        '/'
      );
    },
    exportSubmissionModelsData: function() {
      return {
        asin: this.assetSubmission.asset?.product?.asin || '',
        assetUid: this.assetSubmission.asset.uid,
        name: this.assetSubmission.asset.name,
        submissionId: this.assetSubmission.id,
        submissionNumber: this.assetSubmission.submissionNumber,
      };
    },
    publishAssetSubmissionData: function() {
      return {
        assetUid: this.assetSubmission.asset.uid,
        name: this.assetSubmission.asset.name,
        submissionNumber: this.assetSubmission.submissionNumber,
      };
    },
    renderImagesData: function() {
      return {
        assetUid: this.assetSubmission.asset.uid,
        name: this.assetSubmission.asset.name,
        submissionId: this.assetSubmission.id,
        submissionNumber: this.assetSubmission.submissionNumber,
      };
    },
    ...mapState({
      pickList: (state: any) => state.pickList.pickList,
    }),
  },
  data: () => ({
    errorMessage: '',
    updateRequestSent: false,
    updatePartErrorMessage: '',
    updatePartSuccessMessage: '',
  }),
  methods: {
    cancelSubmission() {
      if (confirm('Are you sure you want to cancel this submission?')) {
        backend
          .post('submission/cancel', {
            id: this.assetSubmission.id,
          })
          .then(result => {
            store.commit.assetSubmission.SET_STATUS_BY_INDEX(ASSET_SUBMISSION_STATUS_TYPE.SUBMISSION_CANCELED);
          })
          .catch(err => {});
      }
    },
    changeStatus(newStatusId: number) {
      this.errorMessage = '';
      backend
        .post('submission/set_status', {
          id: this.assetSubmission.id,
          statusId: newStatusId,
        })
        .then(result => {
          if (result.data == 'success') {
            store.dispatch.product.refresh();
            store.dispatch.assetSubmission.refresh();
          } else {
            this.errorMessage = 'Error Setting Status';
          }
        });
    },
    publishSuccess() {
      store.dispatch.product.refresh();
    },
    refreshSubmission() {
      store.dispatch.assetSubmission.refresh();
    },
    reprocessSubmission() {
      if (confirm('Are you sure you want to re-process this submission?')) {
        backend
          .post('messages/reprocess_submission', {
            id: this.assetSubmission.id,
          })
          .then(result => {
            store.commit.assetSubmission.SET_STATUS_BY_INDEX(ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_VALIDATION);
          })
          .catch(err => {});
      }
    },
    async updatePart() {
      this.updatePartErrorMessage = '';
      this.updatePartSuccessMessage = '';
      if (confirm('This will overwrite the part blend file. Are you sure?')) {
        this.updateRequestSent = true;
        try {
          let updateStatus = await backend.post(
            'part/update_from_submission',
            {
              submissionId: this.assetSubmission.id
            }
          );
          if (updateStatus.data === 'success') {
            this.updatePartSuccessMessage = 'Update Request Sent';
          } else {
            this.updatePartErrorMessage = updateStatus.data;
            this.updateRequestSent = false;
          }
        } catch (e) {
          this.updatePartErrorMessage = 'Error Updating Part';
          this.updateRequestSent = false;
        }
      }
    },
  },
  props: {
    admin: Boolean,
    assetSubmission: { type: Object, required: true },
    loading: Boolean,
    product: Object, // Needed for ASIN
  },
});
</script>
