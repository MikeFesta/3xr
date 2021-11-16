// SPDX-License-Identifier: Apache-2.0
import AssetSubmissionIssueType from '@/store/interfaces/types/AssetSubmissionIssueType';
import AssetSubmissionStatusType from '@/store/interfaces/types/AssetSubmissionStatusType';
import JobPriorityType from '@/store/interfaces/types/JobPriorityType';
import JobQualityType from '@/store/interfaces/types/JobQualityType';
import JobStatusType from '@/store/interfaces/types/JobStatusType';
import JobRiskType from '@/store/interfaces/types/JobRiskType';
import UnitType from '@/store/interfaces/types/UnitType';
import UserRoleType from '@/store/interfaces/types/UserRoleType';

export interface PickListInterface {
  assetSubmissionIssues: Array<AssetSubmissionIssueType>;
  assetSubmissionStatus: Array<AssetSubmissionStatusType>;
  jobPriority: Array<JobPriorityType>;
  jobQuality: Array<JobQualityType>;
  jobStatus: Array<JobStatusType>;
  jobRisk: Array<JobRiskType>;
  units: Array<UnitType>;
  userRole: Array<UserRoleType>;
}

export default class PickList implements PickListInterface {
  assetSubmissionIssues: Array<AssetSubmissionIssueType> = AssetSubmissionIssueType.getPickList();
  assetSubmissionStatus: Array<AssetSubmissionStatusType> = AssetSubmissionStatusType.getPickList();
  jobPriority: Array<JobPriorityType> = JobPriorityType.getPickList();
  jobQuality: Array<JobQualityType> = JobQualityType.getPickList();
  jobRisk: Array<JobRiskType> = JobRiskType.getPickList();
  jobStatus: Array<JobStatusType> = JobStatusType.getPickList();
  units: Array<UnitType> = UnitType.getPickList();
  userRole: Array<UserRoleType> = UserRoleType.getPickList();
}
