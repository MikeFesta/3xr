// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface JobRiskTypeInterface extends IdNameInterface {
  id: JOB_RISK_TYPE;
}

export enum JOB_RISK_TYPE {
  UNKNOWN = 0,
  NO_RISK, // 1
  AT_RISK, // 2
  DUE_TODAY, // 3
  PAST_DUE, // 4
}

export default class JobRiskType extends IdName implements JobRiskTypeInterface {
  id: JOB_RISK_TYPE = JOB_RISK_TYPE.UNKNOWN;
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
      new JobRiskType({ id: JOB_RISK_TYPE.UNKNOWN, name: 'All' }),
      new JobRiskType({ id: JOB_RISK_TYPE.NO_RISK, name: 'No Risk' }),
      new JobRiskType({ id: JOB_RISK_TYPE.AT_RISK, name: 'At Risk' }),
      new JobRiskType({
        id: JOB_RISK_TYPE.DUE_TODAY,
        name: 'Due Today',
      }),
      new JobRiskType({
        id: JOB_RISK_TYPE.PAST_DUE,
        name: 'Past Due',
      }),
    ];
  }
}
