<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="@/views/client/ClientAccount.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import backend from '@/services/3xrCom';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import { mapState } from 'vuex';
import store from '@/store/index';
import { INewBrandRequest, INewClassRequest } from '@/store/interfaces/ClientBrand';

export default Vue.extend({
  name: 'client-account',
  metaInfo: {
    title: 'My Client Account | 3XR',
  },
  components: {
    SpinnerButton,
  },
  computed: {
    ...mapState({
      client: (state: any) => state.client.client,
      user: (state: any) => state.user.user,
    }),
    emailNotifications: {
      get() {
        return store.state.user.user.emailNotifications;
      },
      set(newVal: boolean) {
        this.currentEmailNotifications = newVal;
      },
    },
  },
  created() {
    if (!this.client?.uid) {
      store.dispatch.client.fetchClient();
    }
  },
  data: function () {
    return {
      addBrand: false,
      addClass: false,
      errorMessage: '',
      newBrandName: '',
      newClassName: '',
      successMessage: '',
      saving: false,
      e1: 0,
      currentEmailNotifications: store.state.user.user.emailNotifications,
    };
  },
  methods: {
    async addNewBrand() {
      if (this.newBrandName === '') {
        this.errorMessage = 'Brand Name is required';
        return null;
      }

      const brand: INewBrandRequest = {
        clientId: this.client.id,
        name: this.newBrandName,
      };
      await store.dispatch.client.addBrand(brand);
      this.newBrandName = '';
      this.addBrand = false;
    },
    async addNewClass() {
      if (this.newClassName === '') {
        this.errorMessage = 'Class Name is required';
        return null;
      }

      const cls: INewClassRequest = {
        clientId: this.client.id,
        name: this.newClassName,
      };
      await store.dispatch.client.addClass(cls);
      this.newClassName = '';
      this.addClass = false;
    },
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    deleteBrand(brandId: number) {
      if (confirm('Are you sure that you want to delete this brand?')) {
        backend
          .post('client/delete_brand', {
            brandId: brandId,
          })
          .then((result) => {
            store.commit.client.SET_BRANDS(result.data);
          })
          .catch((err) => {});
      }
    },
    deleteClass(classId: number) {
      if (confirm('Are you sure that you want to delete this class?')) {
        backend
          .post('client/delete_class', {
            classId: classId,
          })
          .then((result) => {
            store.commit.client.SET_CLASSES(result.data);
          })
          .catch((err) => {});
      }
    },
    saveChanges() {
      // TODO: Add company name in backend
      this.clearMessages();
      this.saving = true;
      backend
        .post('user/update', {
          id: store.state.user.user.id,
          firstName: store.state.user.user.firstName,
          lastName: store.state.user.user.lastName,
          email: store.state.user.user.email,
          emailNotifications: this.currentEmailNotifications,
        })
        .then((result) => {
          if (result.data === 'success') {
            this.successMessage = 'Changes Saved';
          } else {
            this.errorMessage = 'Unable to Save Changes';
          }
          this.saving = false;
        })
        .catch((err) => {
          this.errorMessage = 'Update Failed';
          this.saving = false;
        });
    },
    showAddBrand() {
      this.addBrand = true;
      const el: HTMLInputElement = document.getElementById('newBrandName') as HTMLInputElement;
      if (el) {
        this.$nextTick(() => {
          el.focus();
        });
      }
    },
    showAddClass() {
      this.addClass = true;
      const el: HTMLInputElement = document.getElementById('newClassName') as HTMLInputElement;
      if (el) {
        this.$nextTick(() => {
          el.focus();
        });
      }
    },
  },
});
</script>

<style lang="scss">
.brands {
  border-bottom: #f2f2f2 solid 4px;
  border-radius: 0px;
  padding: 0px;
  margin-top: 0px;
  margin-bottom: -10px;
  margin-left: 10px;
  margin-right: 10px;
}
.classes {
  border-bottom: #ccdfeb solid 4px;
  border-radius: 0px;
  padding: 0px;
  margin-top: 0px;
  margin-bottom: -10px;
  margin-left: 10px;
  margin-right: 10px;
}
.close {
  width: 20px;
}
</style>
