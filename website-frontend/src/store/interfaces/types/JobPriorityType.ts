// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface JobPriorityTypeInterface extends IdNameInterface {
  id: JOB_PRIORITY_TYPE;
}

export enum JOB_PRIORITY_TYPE {
  UNKNOWN = 0,
  STANDARD,
  RUSH,
}

export default class JobPriorityType extends IdName implements JobPriorityTypeInterface {
  id: JOB_PRIORITY_TYPE = JOB_PRIORITY_TYPE.UNKNOWN;
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
      new JobPriorityType({ id: JOB_PRIORITY_TYPE.STANDARD, name: 'Standard' }),
      new JobPriorityType({
        id: JOB_PRIORITY_TYPE.RUSH,
        name: 'Expedited (additional cost)',
      }),
    ];
  }
}
