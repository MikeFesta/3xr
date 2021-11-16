// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export default interface AssetSubmissionStatusTypeInterface extends IdNameInterface {
  id: ASSET_SUBMISSION_STATUS_TYPE;
}

export enum ASSET_SUBMISSION_STATUS_TYPE {
  UNKNOWN = 0,
  INITIAL_SUBMISSION, // 1
  SUBMISSION_CANCELED, // 2
  PROCESSING_VALIDATION, // 3
  FAILURE_VALIDATION, // 4
  PROCESSING_RENDER, // 5
  FAILURE_RENDER, // 6
  PROCESSING_TEXTURES, // 7
  FAILURE_TEXTURES, // 8
  PROCESSING_GLB, // 9
  FAILURE_GLB, // 10
  PROCESSING_USDZ, // 11
  FAILURE_USDZ, // 12
  READY_FOR_QA, // 13
  QA_IN_PROGRESS, // 14
  QA_COMPLETE_FAILED, // 15
  QA_COMPLETE_PASSED, // 16
  PROCESSING_COMPLETE, // 17
}

export default class AssetSubmissionStatusType extends IdName implements AssetSubmissionStatusTypeInterface {
  id: ASSET_SUBMISSION_STATUS_TYPE = ASSET_SUBMISSION_STATUS_TYPE.UNKNOWN;
  name: string = '';

  constructor(data: any) {
    super(data);
    if (data) {
      this.id = data.id;
      this.name = data.name;
    }
  }

  static getPickList() {
    return [
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.INITIAL_SUBMISSION,
        name: 'Initial Submission',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.SUBMISSION_CANCELED,
        name: 'Submission Canceled',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_VALIDATION,
        name: 'Processing - Validation',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.FAILURE_VALIDATION,
        name: 'Processing Error',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_RENDER,
        name: 'Processing - Rendering',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.FAILURE_RENDER,
        name: 'Failure Rendering',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_TEXTURES,
        name: 'Processing - Textures',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.FAILURE_TEXTURES,
        name: 'Failed processing textures',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_GLB,
        name: 'Processing GLB',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.FAILURE_GLB,
        name: 'Failed Processing GLB',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_USDZ,
        name: 'Processing USDZ',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.FAILURE_USDZ,
        name: 'Failed processing USDZ',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.READY_FOR_QA,
        name: 'Ready for QA',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.QA_IN_PROGRESS,
        name: 'QA in Progress',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.QA_COMPLETE_FAILED,
        name: 'QA Complete - Failed',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.QA_COMPLETE_PASSED,
        name: 'QA Complete - Passed',
      }),
      new AssetSubmissionStatusType({
        id: ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_COMPLETE,
        name: 'Processing Complete',
      }),
    ];
  }
}
