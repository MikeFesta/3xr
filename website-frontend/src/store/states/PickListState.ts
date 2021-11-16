import PickList from '@/store/interfaces/PickList';

export interface PickListState {
  pickList: PickList;
}

export default {
  namespaced: true as true,
  state: {
    pickList: new PickList(),
  } as PickListState,
  mutations: {},
  getters: {},
  actions: {},
};
