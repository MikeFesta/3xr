<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/components/buttons/RabbitButton.pug"></template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';

export default Vue.extend({
  name: 'rabbit-button',
  components: {
    SpinnerButton,
  },
  data: function() {
    return {
      errorMessage: '',
      loadingLabel: '',
      messageId: 0,
      pingCount: 0,
      processing: false,
      successMessage: '',
    };
  },
  methods: {
    submit() {
      this.errorMessage = '';
      this.successMessage = '';
      if (!this.confirmMessage || confirm(this.confirmMessage)) {
        this.processing = true;
        this.loadingLabel = 'Sending Message';
        let dataToSend = this.data;
        if (this.dataFunction) {
          dataToSend = this.dataFunction();
        }
        backend
          .post('/rabbit/queue_message', {
            data: dataToSend,
            queue: this.queue,
          })
          .then(result => {
            this.messageId = result.data;
            this.loadingLabel = 'Queued';
            // TODO: keep checking the status until it is resolved
            this.updateStatus();
          })
          .catch(err => {
            this.errorMessage = err.toString();
            this.processing = false;
          });
      }
    },
    updateStatus() {
      if (this.messageId > 0) {
        backend
          .get('/rabbit/status/' + this.messageId)
          .then(result => {
            // TODO: refactor this on the server
            this.loadingLabel = result.data.status_text.text;
            // TODO: add these status ids to an enum
            if (result.data.status_id == 1 || result.data.status_id == 2) {
              if (this.pingCount < 240) {
                this.pingCount = this.pingCount + 1;
                setTimeout(this.updateStatus, 5000);
              } else {
                this.processing = false;
                this.successMessage = 'Timed Out';
              }
            } else if (result.data.status_id == 3) {
              this.processing = false;
              this.errorMessage = result.data.error_message;
              if (this.failureCallback) {
                this.failureCallback();
              }
            } else if (result.data.status_id == 4) {
              this.processing = false;
              this.successMessage = result.data.status_text.text;
              if (this.successCallback) {
                this.successCallback();
              }
            }
          })
          .catch(err => {
            this.errorMessage = err.toString();
            this.processing = false;
          });
      }
    },
  },
  props: {
    color: String,
    confirmMessage: String,
    data: Object,
    dataFunction: Function,
    disabled: Boolean,
    failureCallback: Function,
    icon: String,
    label: {
      type: String,
      required: true,
    },
    queue: {
      type: String,
      required: true,
    },
    successCallback: Function,
  },
});
</script>
