// SPDX-License-Identifier: Apache-2.0
export interface AssetSubmissionIssueHotspotInterface {
  assetSubmissionIssueId: number;
  deleted: boolean;
  id: number;
  normal: string;
  position: string;
}

export default class AssetSubmissionIssueHotspot implements AssetSubmissionIssueHotspotInterface {
  assetSubmissionIssueId: number = 0;
  deleted: boolean = false;
  id: number = 0;
  normal: string = '';
  position: string = '';

  constructor(data: any) {
    if (data) {
      this.assetSubmissionIssueId = data.assetSubmissionIssueId;
      this.id = data.id;
      this.normal = data.normal;
      this.position = data.position;
    }
  }
}
