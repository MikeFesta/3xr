// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface JobStatusTypeInterface extends IdNameInterface {
  id: JOB_STATUS_TYPE;
}

export enum JOB_STATUS_TYPE {
  UNKNOWN = 0,
  UNASSIGNED, // 1
  ASSIGNED, // 2
  IN_PROGRESS, // 3
  SELF_QA, // 4
  TECHNICAL_QA, // 5
  REVISION_NEEDED, // 6
  IN_REWORK, // 7
  CLIENT_QA, // 8
  COMPLETE, // 9
  CANCELLED, // 10
  PENDING_REVIEW = 16,
}

export default class JobStatusType extends IdName implements JobStatusTypeInterface {
  id: JOB_STATUS_TYPE = JOB_STATUS_TYPE.UNKNOWN;
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
      new JobStatusType({ id: JOB_STATUS_TYPE.UNKNOWN, name: 'All' }),
      new JobStatusType({ id: JOB_STATUS_TYPE.UNASSIGNED, name: 'Unassigned' }),
      new JobStatusType({ id: JOB_STATUS_TYPE.ASSIGNED, name: 'Assigned' }),
      new JobStatusType({
        id: JOB_STATUS_TYPE.IN_PROGRESS,
        name: 'In Progress',
      }),
      new JobStatusType({
        id: JOB_STATUS_TYPE.SELF_QA,
        name: 'Modeler QA',
      }),
      new JobStatusType({
        id: JOB_STATUS_TYPE.TECHNICAL_QA,
        name: 'Technical QA',
      }),
      new JobStatusType({
        id: JOB_STATUS_TYPE.REVISION_NEEDED,
        name: 'Revision Needed',
      }),
      new JobStatusType({
        id: JOB_STATUS_TYPE.IN_REWORK,
        name: 'In Rework',
      }),
      new JobStatusType({
        id: JOB_STATUS_TYPE.CLIENT_QA,
        name: 'Client QA',
      }),
      new JobStatusType({ id: JOB_STATUS_TYPE.COMPLETE, name: 'Complete' }),
      new JobStatusType({ id: JOB_STATUS_TYPE.CANCELLED, name: 'Cancelled' }),
      new JobStatusType({ id: JOB_STATUS_TYPE.PENDING_REVIEW, name: 'Pending Review' }),
    ];
  }
}
