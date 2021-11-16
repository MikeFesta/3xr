// SPDX-License-Identifier: Apache-2.0
import AssetSubmissionIssue, { AssetSubmissionIssueInterface } from '@/store/interfaces/AssetSubmissionIssue';

export interface AssetSubmissionIssueState {
  assetSubmission: AssetSubmissionIssueInterface;
}

export default {
  namespaced: true as true,
  state: {
    assetSubmission: new AssetSubmissionIssue(null),
  } as AssetSubmissionIssueState,
  mutations: {
    CLEAR(state: AssetSubmissionIssueState) {
      state.assetSubmission = new AssetSubmissionIssue(null);
    },
    SET(state: AssetSubmissionIssueState, assetSubmission: AssetSubmissionIssueInterface) {
      state.assetSubmission = new AssetSubmissionIssue(assetSubmission);
    },
  },
};
