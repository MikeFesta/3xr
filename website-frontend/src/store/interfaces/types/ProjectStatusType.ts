// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface ProjectStatusTypeInterface extends IdNameInterface {
  id: PROJECT_STATUS_TYPE;
}

export enum PROJECT_STATUS_TYPE {
  UNKNOWN = 0,
  UNSUBMITTED,
  IN_PROGRESS,
  COMPLETE,
  CANCELLED,
}

export default class ProjectStatusType extends IdName implements ProjectStatusTypeInterface {
  id: PROJECT_STATUS_TYPE = PROJECT_STATUS_TYPE.UNKNOWN;
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
      new ProjectStatusType({
        id: PROJECT_STATUS_TYPE.UNSUBMITTED,
        name: 'Unsubmitted',
      }),
      new ProjectStatusType({
        id: PROJECT_STATUS_TYPE.IN_PROGRESS,
        name: 'In Progress',
      }),
      new ProjectStatusType({
        id: PROJECT_STATUS_TYPE.COMPLETE,
        name: 'Complete',
      }),
      new ProjectStatusType({
        id: PROJECT_STATUS_TYPE.CANCELLED,
        name: 'Cancelled',
      }),
    ];
  }
}
