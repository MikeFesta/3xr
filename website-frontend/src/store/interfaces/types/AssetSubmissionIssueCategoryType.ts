// SPDX-License-Identifier: Apache-2.0
import AssetSubmissionIssueType from '@/store/interfaces/types/AssetSubmissionIssueType';

export interface AssetSubmissionIssueCategoryTypeInterface {
  id: ASSET_SUBMISSION_ISSUE_CATEGORY_TYPE;
  name: string;
  label: string;
  sortWeight: number;
  types: Array<AssetSubmissionIssueType>;
  setTypes(types: Array<AssetSubmissionIssueType>): void;
}

export enum ASSET_SUBMISSION_ISSUE_CATEGORY_TYPE {
  UNKNOWN = 0,
  PRODUCT,
  MODEL,
  TEXTURES,
  AR,
}

export default class AssetSubmissionIssueCategoryType implements AssetSubmissionIssueCategoryTypeInterface {
  id: ASSET_SUBMISSION_ISSUE_CATEGORY_TYPE = ASSET_SUBMISSION_ISSUE_CATEGORY_TYPE.UNKNOWN;
  name: string = '';
  label: string = '';
  sortWeight: number = 0;
  types: Array<AssetSubmissionIssueType> = [];

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.label = data.label;
      this.sortWeight = data.sortWeight;
      this.setTypes(data.types);
    }
  }
  setTypes(types: Array<AssetSubmissionIssueType>) {
    this.types = [];
    if (types) {
      types.forEach((type: AssetSubmissionIssueType) => {
        this.types.push(new AssetSubmissionIssueType(type));
      });
    }
  }
}
