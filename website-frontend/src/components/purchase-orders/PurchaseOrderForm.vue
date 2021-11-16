<!-- SPDX-License-Identifier: Apache-2.0 -->
<template lang="pug" src="./PurchaseOrderForm.pug">
</template>

<script lang="ts">
import Vue from 'vue';
import { mapGetters, mapState } from 'vuex';
import SpinnerButton from '@/components/buttons/SpinnerButton.vue';
import store, { RootState } from '@/store/index';
import { ClientBrandInterface } from '@/store/interfaces/ClientBrand';
import { ClientClassInterface } from '@/store/interfaces/ClientClass';
import { IPurchaseOrderRequest, IPurchaseOrderImportHoldingRequest } from '@/store/interfaces/PurchaseOrder';
import router from '@/router';
import ToDo from '@/components/misc/ToDo.vue';

export default Vue.extend({
  name: 'purchase-order-form',
  components: {
    SpinnerButton,
    ToDo,
  },
  data: function () {
    return {
      dialogArtist: false,
      dialogBrand: false,
      dialogClass: false,
      dialogClient: false,
      dialogDeadline: false,
      dialogName: false,
      dialogStudio: false,
      dialogUnits: false,
      errorMessage: '',
      loadingLocal: false,
      spinner: false,
      successMessage: '',
      currentBrand: '',
      currentClass: '',
      deadlineCalendar: false,
      currentProjectHoldingId: null as null | number,
    };
  },
  computed: {
    ...mapGetters('artists', ['artistFilter']),
    ...mapState({
      artists(state: RootState) {
        return state.artists.artists;
      },
      client: (state: RootState) => state.client.client,
      clientBrands: (state: RootState) => state.clientBrands.clientBrands,
      clientClasses: (state: RootState) => state.clientClasses.clientClasses,
      clients: (state: RootState) => state.clients.clients,
      pickList: (state: RootState) => state.pickList.pickList,
      projectHoldings: (state: RootState) => state.projectHoldings.projectHoldings,
      purchaseOrder: (state: RootState) => state.project.project,
      purchaseOrderIsNew: (state: RootState) => state.project.project.id === 0,
      user: (state: RootState) => state.user.user,
      studios: (state: RootState) => state.studios.studios,
    }),
    isAdmin: () => store.getters.user.isAdmin,
    isClient: () => store.getters.user.isClient,
    isStudioAdmin: () => store.getters.user.isStudioAdmin,
    brand: {
      get(): ClientBrandInterface {
        return store.state.project.project.brand;
      },
      set(value: ClientBrandInterface | string) {
        if (typeof value === 'string') {
          this.currentBrand = value;
        } else {
          this.currentBrand = '';
          store.dispatch.project.updateBrand(value);
        }
      },
    },
    classPO: {
      get(): ClientClassInterface {
        return store.state.project.project.class;
      },
      set(value: ClientClassInterface | string) {
        if (typeof value === 'string') {
          this.currentClass = value;
        } else {
          this.currentClass = '';
          store.dispatch.project.updateClass(value);
        }
      },
    },
  },
  watch: {
    currentProjectHoldingId(newVal: number) {
      const currentRecord = this.projectHoldings.find(({ id }) => id === newVal);
      if (currentRecord) {
        this.purchaseOrder.name = currentRecord.name;
      }
    },
  },
  async created() {
    this.loadingLocal = true;
    // Load data for the picklists
    try {
      await this.loadClients();
      await this.loadStudios();
      await this.loadArtists();
      await this.loadBrands();
      await this.loadClasses();
    } catch (err: any) {
      this.errorMessage = err;
    }
    this.loadingLocal = false;
  },
  methods: {
    clearMessages() {
      this.errorMessage = '';
      this.successMessage = '';
    },
    async createProject() {
      this.clearMessages();
      //await this.updateBrandAndClass();

      const isFormValid = this.validateForm();
      if (!isFormValid) {
        return null;
      }
      this.spinner = true;
      try {
        // create project from holding table if product group selected
        if (this.currentProjectHoldingId) {
          const newProject: IPurchaseOrderImportHoldingRequest = {
            artistId: this.purchaseOrder.artist.id,
            brandId: this.purchaseOrder.brand.id,
            classId: this.purchaseOrder.class.id,
            clientId: this.client.id,
            dateDue: this.purchaseOrder.dateDue,
            name: this.purchaseOrder.name,
            priorityId: this.purchaseOrder.priority.id,
            qualityId: this.purchaseOrder.quality.id,
            unitTypeId: this.purchaseOrder.units.id,
            projectHoldingId: this.currentProjectHoldingId,
          };
          await store.dispatch.project.createProjectHolding(newProject);
        } else {
          const newProject: IPurchaseOrderRequest = {
            artistId: this.purchaseOrder.artist.id,
            brandId: this.purchaseOrder.brand.id,
            classId: this.purchaseOrder.class.id,
            clientId: this.purchaseOrder.client.id,
            dateDue: this.purchaseOrder.dateDue,
            defaultPrice: this.purchaseOrder.defaultPrice,
            name: this.purchaseOrder.name,
            studioId: this.purchaseOrder.studio.id,
            unitTypeId: this.purchaseOrder.units.id,
          };
          await store.dispatch.project.createProject(newProject);
        }
        router.push({
          name: 'purchase-order-products',
          params: { projectUid: store.state.project.project.uid },
        });
      } catch (_) {
        this.errorMessage = 'Failed to Create P.O.';
      } finally {
        this.spinner = false;
      }
    },
    async loadArtists() {
      await store.dispatch.artists.loadForStudio(this.purchaseOrder.studio.id);
      if (this.artists.length == 0) {
        this.errorMessage = 'That studio does not have any artists';
      } else {
        if (!this.purchaseOrder.artist.id) {
          this.purchaseOrder.artist.id = this.artists[0].id;
        }
      }
    },
    async loadBrands() {
      await store.dispatch.clientBrands.loadForClient(this.purchaseOrder.client.id);
      if (this.clientBrands.length == 0) {
        this.errorMessage = 'Selected client does not have any brands';
      } else {
        if (!this.purchaseOrder.brand.id) {
          this.purchaseOrder.brand.id = this.clientBrands[0].id;
        }
      }
    },
    async loadClasses() {
      await store.dispatch.clientClasses.loadForClient(this.purchaseOrder.client.id);
      if (this.clientClasses.length == 0) {
        this.errorMessage = 'Selected client does not have any classes';
      } else {
        if (!this.purchaseOrder.class.id) {
          this.purchaseOrder.class.id = this.clientClasses[0].id;
        }
      }
    },
    async loadClients() {
      await store.dispatch.clients.loadForUser(this.user.id);
      if (this.clients.length == 0) {
        this.errorMessage = 'Your user account is not associated with any clients';
      } else {
        if (!this.purchaseOrder.client.id) {
          this.purchaseOrder.client.id = this.clients[0].id;
        }
      }
    },
    async loadStudios() {
      await store.dispatch.studios.loadForUser(this.user.id);
      if (this.studios.length == 0) {
        this.errorMessage = 'Your user account is not associated with any studios';
      } else {
        if (!this.purchaseOrder.studio.id) {
          this.purchaseOrder.studio.id = this.studios[0].id;
        }
      }
    },
    async saveProject() {
      this.clearMessages();
      //await this.updateBrandAndClass();
      const isFormValid = this.validateForm();
      if (!isFormValid) {
        return null;
      }
      this.spinner = true;
      const project: IPurchaseOrderRequest = {
        artistId: this.purchaseOrder.artist.id,
        brandId: this.purchaseOrder.brand.id,
        classId: this.purchaseOrder.class.id,
        clientId: this.purchaseOrder.client.id,
        dateDue: this.purchaseOrder.dateDue,
        defaultPrice: this.purchaseOrder.defaultPrice,
        name: this.purchaseOrder.name,
        studioId: this.purchaseOrder.studio.id,
        uid: this.purchaseOrder.uid,
        unitTypeId: this.purchaseOrder.units.id,
      };
      try {
        await store.dispatch.project.updateProject(project);
        router.push({
          name: 'purchase-order-products',
          params: { projectUid: store.state.project.project.uid },
        });
      } catch (_) {
        this.errorMessage = 'Failed to Save P.O.';
      } finally {
        this.spinner = false;
      }
    },
    async updateBrandAndClass() {
      await this.loadBrands();
      await this.loadClasses();
      //await this.loadClasses();
      /*
      if (this.currentBrand) {
        const newBrand: INewBrandRequest = {
          clientId: this.purchaseOrder.client.id,
          name: this.currentBrand,
        };
        const result = await store.dispatch.client.addBrand(newBrand);
        const addedBrand = result.find((brand: ClientBrandInterface) => brand.name === newBrand.name);
        this.brand = addedBrand;
      }

      if (this.currentClass) {
        const newClass: INewClassRequest = {
          clientId: this.purchaseOrder.client.id,
          name: this.currentClass,
        };
        const result = await store.dispatch.client.addClass(newClass);
        const addedClass = result.find((cls: ClientClassInterface) => cls.name === newClass.name);
        this.classPO = addedClass;
      }
      */
    },
    updateFromPicklist() {
      store.commit.project.UPDATE_FROM_PICKLIST();
    },
    validateForm(): boolean {
      this.errorMessage = '';
      let result = this.validateSelectData(
        this.purchaseOrder.brand.id,
        'Brand is Required. Reach out to a 3XR admin if a brand is missing.',
      );
      result = this.validateInputElement('name', 'P.O. Name is Required') && result;
      result = this.validateInputElement('dateDue', 'Select a Due Date') && result;
      result =
        this.validateSelectData(
          this.purchaseOrder.class.id,
          'Class is Required. Reach out to a 3XR admin if a class is missing.',
        ) && result;
      result =
        this.validateSelectData(
          this.purchaseOrder.client.id,
          'Client is Required. Reach out to a 3XR admin if a client is missing.',
        ) && result;
      result =
        this.validateSelectData(
          this.purchaseOrder.studio.id,
          'Studio is Required. Reach out to a 3XR admin if a studio is missing.',
        ) && result;
      result = this.validateSelectData(this.purchaseOrder.units.id, 'Select the Default Units') && result;
      return result;
    },
    validateInputElement(id: string, message: string) {
      const el: HTMLInputElement = document.getElementById(id) as HTMLInputElement;
      if (!el) {
        this.errorMessage += 'Unable to find ' + id + '\n';
        return false;
      }
      if (!el.checkValidity()) {
        this.errorMessage += message + '\n';
        return false;
      }
      return true;
    },
    validateSelectData(data: number, message: string) {
      if (!data) {
        this.errorMessage += message + '\n';
        return false;
      }
      return true;
    },
  },
  props: {
    loading: Boolean,
  },
});
</script>

<style lang="scss">
.project-imports-info {
  color: #0b82c5;
}
</style>