// SPDX-License-Identifier: Apache-2.0
import { ActionContext } from 'vuex';
import {
  AssetSubmissionIssueHotspotInterface,
} from '@/store/interfaces/AssetSubmissionIssueHotspot';

export interface AssetSubmissionIssueHotspotsState {
  assetSubmissionIssueHotspots: Array<AssetSubmissionIssueHotspotInterface>;
  assetSubmissionIssueId: number;
  addingHotspot: boolean;
}

export default {
  namespaced: true as true,
  state: {
    assetSubmissionIssueHotspots: [],
    assetSubmissionIssueId: 0,
    addingHotspot: false,
  } as AssetSubmissionIssueHotspotsState,
  mutations: {
    ADD_HOTSPOT(state: AssetSubmissionIssueHotspotsState, hotspot: AssetSubmissionIssueHotspotInterface) {
      state.assetSubmissionIssueHotspots.push(hotspot);
    },
    CLEAR(state: AssetSubmissionIssueHotspotsState) {
      state.assetSubmissionIssueHotspots = [];
      state.addingHotspot = false;
    },
    REMOVE_BY_ID(state: AssetSubmissionIssueHotspotsState, id: number) {
      for (let i = 0; i < state.assetSubmissionIssueHotspots.length; i++) {
        if (state.assetSubmissionIssueHotspots[i].id == id) {
          state.assetSubmissionIssueHotspots[i].deleted = true;
        }
      }
    },
    SET_ID(state: AssetSubmissionIssueHotspotsState, id: number) {
      state.assetSubmissionIssueId = id;
    },
    START_ADDING(state: AssetSubmissionIssueHotspotsState) {
      state.addingHotspot = true;
    },
    STOP_ADDING(state: AssetSubmissionIssueHotspotsState) {
      state.addingHotspot = false;
    },
  },
  actions: {
    addHotspot(
      { commit }: ActionContext<AssetSubmissionIssueHotspotsState, AssetSubmissionIssueHotspotsState>,
      hotspot: AssetSubmissionIssueHotspotInterface,
    ) {
      return commit('ADD_HOTSPOT', hotspot);
    },
    clear({ commit }: ActionContext<AssetSubmissionIssueHotspotsState, AssetSubmissionIssueHotspotsState>) {
      return commit('CLEAR');
    },
    removeHotspot(
      { commit }: ActionContext<AssetSubmissionIssueHotspotsState, AssetSubmissionIssueHotspotsState>,
      issueId: number,
    ) {
      return commit('REMOVE_BY_ID', issueId);
    },
    selectIssue(
      { commit }: ActionContext<AssetSubmissionIssueHotspotsState, AssetSubmissionIssueHotspotsState>,
      issueId: number,
    ) {
      return commit('SET_ID', issueId);
    },
    startAdding({ commit }: ActionContext<AssetSubmissionIssueHotspotsState, AssetSubmissionIssueHotspotsState>) {
      return commit('START_ADDING');
    },
    stopAdding({ commit }: ActionContext<AssetSubmissionIssueHotspotsState, AssetSubmissionIssueHotspotsState>) {
      return commit('STOP_ADDING');
    },
  },
};
