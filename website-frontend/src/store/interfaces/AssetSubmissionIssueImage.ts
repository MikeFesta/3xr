// SPDX-License-Identifier: Apache-2.0
export interface AssetSubmissionIssueImageInterface {
  assetSubmissionIssueId: number;
  filename: string;
  id: number;
}

export default class AssetSubmissionIssueImage implements AssetSubmissionIssueImageInterface {
  assetSubmissionIssueId: number = 0;
  filename: string = '';
  id: number = 0;

  constructor(data: any) {
    if (data) {
      this.filename = data.filename;
      this.assetSubmissionIssueId = data.assetSubmissionIssueId;
      this.id = data.id;
    }
  }
}
