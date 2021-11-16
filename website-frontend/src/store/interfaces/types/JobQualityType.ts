// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface JobQualityTypeInterface extends IdNameInterface {
  id: JOB_QUALITY_TYPE;
}

export enum JOB_QUALITY_TYPE {
  UNKNOWN = 0,
  STANDARD,
  HIGHEST,
}

export default class JobQualityType extends IdName implements JobQualityTypeInterface {
  id: JOB_QUALITY_TYPE = JOB_QUALITY_TYPE.UNKNOWN;
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
      new JobQualityType({ id: JOB_QUALITY_TYPE.STANDARD, name: 'Standard' }),
      new JobQualityType({
        id: JOB_QUALITY_TYPE.HIGHEST,
        name: 'Highest (additional cost)',
      }),
    ];
  }
}
