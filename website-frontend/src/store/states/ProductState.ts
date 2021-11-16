// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import x from '@/services/x';
import backend from '@/services/3xrCom';
import Product, {
  ProductInterface,
  ProducUpdatetImageInterface as ProductUpdateProductImageInterface,
  ProductDeleteImageInterface as ProductDeleteProductImageInterface,
  ProductDeleteAdditionalImageInterface,
} from '@/store/interfaces/Product';
import { RootState } from '@/store/index';
import ProductAdditionalFile from '@/store/interfaces/ProductAdditionalFile';
import ProductReferenceImage from '@/store/interfaces/ProductReferenceImage';

export interface ProductState {
  product: ProductInterface;
  isUploadingFile: boolean;
  uploadProgress: number;
}

export interface AssignArtistRequest {
  uids: string[];
  artistId: number;
  projectUid: string;
}

export default {
  namespaced: true as true,
  state: {
    product: new Product(null),
    isUploadingFile: false,
    uploadProgress: 0,
  } as ProductState,
  mutations: {
    CLEAR(state: ProductState) {
      state.product = new Product(null);
    },
    SET_PRODUCT(state: ProductState, product: ProductInterface) {
      state.product = new Product(product);
    },
    UPDATE_IS_UPLOADING_FILE(state: ProductState, isUploadingFile: boolean) {
      state.isUploadingFile = isUploadingFile;
    },
    UPDATE_UPLOAD_PROGRESS(state: ProductState, uploadProgress: number) {
      state.uploadProgress = uploadProgress;
    },
    UPDATE_ADDITIONAL_FILE(state: ProductState, files: Array<ProductAdditionalFile>) {
      state.product.additionalFiles = files.map((data: any) => new ProductAdditionalFile(data, state.product.uid));
    },
    UPDATE_REFERENCE_IMAGES(state: ProductState, images: Array<ProductReferenceImage>) {
      state.product.referenceImages = images.map((data: any) => new ProductReferenceImage(data, state.product.uid));
    },
  },
  getters: {},
  actions: {
    async fetchByUid({ commit, state }: ActionContext<ProductState, RootState>, uid: string) {
      if (state.product.uid !== uid) {
        commit('CLEAR');
      }
      try {
        // TODO: product details has more nested data than needed (ie submissions)
        const productResult = await backend.get(`/product/details/${uid}`);
        commit('SET_PRODUCT', productResult.data);
      } catch (err) {
        throw err;
      }
    },
    // Additional files
    async deleteAdditionalFile(
      { state, commit, dispatch }: ActionContext<ProductState, RootState>,
      payload: ProductDeleteAdditionalImageInterface,
    ) {
      const response = await backend.post('product/delete_additional_file', payload);
      commit('UPDATE_ADDITIONAL_FILE', response.data);
      if (state.product.uid === payload.uid) {
        await dispatch('refresh');
      }
    },
    async uploadProductAdditionalFiles(
      { commit, dispatch, state }: ActionContext<ProductState, RootState>,
      files: File[],
    ): Promise<boolean> {
      try {
        let formData = new FormData();
        formData.append('uid', state.product.uid);
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
        await dispatch('uploadStart');
        const result = await x.post('upload/product_additional_files', formData, {
          onUploadProgress: function (progressEvent: ProgressEvent) {
            const progressPercent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            commit('UPDATE_UPLOAD_PROGRESS', progressPercent);
          },
        });
        await dispatch('uploadEnd');
        return result.data === 'success' ? true : false;
      } catch (e) {
        return false;
      }
    },
    // Reference images
    async updatePrimaryReferenceImage(
      { state, commit, dispatch }: ActionContext<ProductState, RootState>,
      payload: ProductUpdateProductImageInterface,
    ) {
      const response = await backend.post('product/set_primary_reference_image', payload);
      commit('UPDATE_REFERENCE_IMAGES', response.data);
      if (state.product.uid === payload.uid) {
        await dispatch('refresh');
      }
    },
    async deleteReferenceImage(
      { state, commit, dispatch }: ActionContext<ProductState, RootState>,
      payload: ProductDeleteProductImageInterface,
    ) {
      const response = await backend.post('product/delete_reference_image', payload);
      await commit('UPDATE_REFERENCE_IMAGES', response.data);
      if (state.product.uid === payload.uid) {
        await dispatch('refresh');
      }
    },
    async uploadProductReferenceImage(
      { commit, dispatch, state }: ActionContext<ProductState, RootState>,
      files: File[],
    ): Promise<boolean> {
      try {
        let formData = new FormData();
        formData.append('uid', state.product.uid);
        for (let i = 0; i < files.length; i++) {
          formData.append('images', files[i]);
        }
        await dispatch('uploadStart');
        const result = await x.post('upload/product_reference_images', formData, {
          onUploadProgress: function (progressEvent: ProgressEvent) {
            const progressPercent = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            commit('UPDATE_UPLOAD_PROGRESS', progressPercent);
          },
        });
        await dispatch('uploadEnd');
        return result.data === 'success' ? true : false;
      } catch (e) {
        return false;
      }
    },
    async uploadStart({ commit }: ActionContext<ProductState, RootState>) {
      commit('UPDATE_UPLOAD_PROGRESS', 0);
      commit('UPDATE_IS_UPLOADING_FILE', true);
    },
    async uploadEnd({ commit, dispatch }: ActionContext<ProductState, RootState>) {
      commit('UPDATE_UPLOAD_PROGRESS', 0);
      commit('UPDATE_IS_UPLOADING_FILE', false);
      await dispatch('refresh');
    },
    async refresh({ state, dispatch }: ActionContext<ProductState, RootState>) {
      return dispatch('fetchByUid', state.product.uid);
    },
    async assignArtist({ dispatch }: ActionContext<ProductState, RootState>, request: AssignArtistRequest) {
      const result = await backend.post('/product/assign_artist', request);
      if (result.data) {
        dispatch('project/fetchProjectAndJobsByIdAdmin', request.projectUid, { root: true });
      }
    },
  },
};
