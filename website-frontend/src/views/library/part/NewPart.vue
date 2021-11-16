<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/library/part/NewPart.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { vuetifyComponents } from '@/plugins/vuetify';
import backend from '@/services/3xrCom';
import LibraryTabs from '@/components/navigation/LibraryTabs.vue';
import { mapState } from 'vuex';
import router from '@/router/index';
import store from '@/store/index';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import XrImg from '@/components/image/XrImg.vue';

export default Vue.extend({
  name: 'new-part',
  metaInfo: {
    title: 'New Part | 3XR',
  },
  components: {
    LibraryTabs,
    SpinnerButton,
    XrImg,
    ...vuetifyComponents,
  },
  computed: {
    blendName: function (): string {
      return JSON.stringify(this.name.replace(/\s+/g, '_').toLowerCase()).replace(/\W/g, '').substring(0, 40);
    },
    ...mapState({
      assetSubmission: (state: any) => state.assetSubmission.assetSubmission,
    }),
  },
  created: function () {
    if (this.submissionId) {
      store.dispatch.assetSubmission.fetchById(this.submissionId);
    }
  },
  data: () => ({
    errorMessage: '',
    name: '',
    saving: false,
    successMessage: '',
    uid: '',
  }),
  props: {
    submissionId: Number,
  },
  methods: {
    clearMessages: function (): void {
      this.errorMessage = '';
      this.successMessage = '';
    },
    createPart: async function (): Promise<void> {
      try {
        this.clearMessages();
        if (this.validateForm()) {
          this.saving = true;
          const result = await backend.post('part/new', {
            name: this.name,
            submissionId: this.submissionId,
            uid: this.uid,
          });
          this.saving = false;
          if (result.data.success) {
            this.successMessage = this.name + ' Created Successfully with UID: ' + result.data.uid;
            this.name = '';
            router.push({ name: 'part-details', params: { uid: result.data.uid } });
          } else {
            this.errorMessage = result.data.errorMessage || 'Unknown Error';
          }
        }
      } catch (e) {
        this.saving = false;
        this.errorMessage = 'Unable to create part';
      }
    },
    lowercaseUid: function (): void {
      this.uid = this.uid.toLowerCase();
    },
    validateForm: function (): boolean {
      const validUid = this.validateUid();
      if (validUid !== true) {
        if (validUid !== false) {
          this.errorMessage = validUid;
        }
        return false;
      }
      if (this.name.length == 0) {
        this.errorMessage = 'Part Name is Missing';
        return false;
      }
      return true;
    },
    validateUid: function (): boolean | string {
      if (this.uid.length === 0) {
        return true;
      }
      const uidRegex = new RegExp('^[a-z0-9]{12}$');
      if (!uidRegex.test(this.uid)) {
        return 'UID needs to be exactly 12 alphanumeric (a-z0-9) characters or left blank';
      }
      return true;
    },
  },
});
</script>
