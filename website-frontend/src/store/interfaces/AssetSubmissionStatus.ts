// SPDX-License-Identifier: Apache-2.0
import {
  ASSET_SUBMISSION_STATUS_TYPE,
} from '@/store/interfaces/types/AssetSubmissionStatusType';

export interface AssetSubmissionStatusInterface {
  id: ASSET_SUBMISSION_STATUS_TYPE;
  name: string;
  resubmissionAllowed: boolean;
  setFromIndex(index: number): void;
}

export default class emptyAssetSubmissionStatusInterface implements AssetSubmissionStatusInterface {
  id: ASSET_SUBMISSION_STATUS_TYPE = ASSET_SUBMISSION_STATUS_TYPE.UNKNOWN;
  name: string = '';
  resubmissionAllowed: boolean = false;

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.resubmissionAllowed = data.resubmissionAllowed;
    }
  }
  setFromIndex(index: number) {
    // TODO: decide if this can live here or only come from the server, if it stays, add resubmissionAllowed
    this.id = index;
    switch (index) {
      case ASSET_SUBMISSION_STATUS_TYPE.INITIAL_SUBMISSION:
        this.name = 'Initial Submission';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.SUBMISSION_CANCELED:
        this.name = 'Submission Canceled';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_VALIDATION:
        this.name = 'Processing - Validation';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.FAILURE_VALIDATION:
        this.name = 'Processing Failure';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_RENDER:
        this.name = 'Processing - Rendering';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.FAILURE_RENDER:
        this.name = 'Failure Rendering';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_TEXTURES:
        this.name = 'Processing - Textures';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.FAILURE_TEXTURES:
        this.name = 'Failed processing textures';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_GLB:
        this.name = 'Processing GLB';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.FAILURE_GLB:
        this.name = 'Failed processing GLB';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_USDZ:
        this.name = 'Processing USDZ';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.FAILURE_USDZ:
        this.name = 'Failed processing USDZ';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.READY_FOR_QA:
        this.name = 'Ready for QA';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.QA_IN_PROGRESS:
        this.name = 'QA in Progress';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.QA_COMPLETE_FAILED:
        this.name = 'QA Complete - Needs Revision';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.QA_COMPLETE_PASSED:
        this.name = 'QA Complete - Passed';
        break;
      case ASSET_SUBMISSION_STATUS_TYPE.PROCESSING_COMPLETE:
        this.name = 'Processing Complete';
        break;
      default:
        this.name = 'Unknown';
        break;
    }
  }
}
