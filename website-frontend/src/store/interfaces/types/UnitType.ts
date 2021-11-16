// SPDX-License-Identifier: Apache-2.0
import { UnitTypeAttributes } from '3xr_types';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';

export interface UnitTypeInterface extends UnitTypeAttributes, SequelizePicklistInterface {
  id: UNIT_TYPE;
  convertToMeters(value: number): number;
}

export enum UNIT_TYPE {
  UNKNOWN = 0,
  METERS,
  INCHES,
  CENTIMETERS,
}

export default class UnitType extends SequelizePicklist implements UnitTypeInterface {
  id: UNIT_TYPE = UNIT_TYPE.UNKNOWN;

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.id = data.id; // needed here because Sequelize Picklist id init is not working due to a number type
    }
  }

  convertToMeters(value: number) {
    switch (this.id) {
      case UNIT_TYPE.METERS:
        return value;
      case UNIT_TYPE.CENTIMETERS:
        return value / 100;
      case UNIT_TYPE.INCHES:
        return value * 0.0254;
      default:
        return 0;
    }
  }

  static getPickList() {
    return [
      new UnitType({ id: UNIT_TYPE.METERS, name: 'Meters' }),
      new UnitType({ id: UNIT_TYPE.INCHES, name: 'Inches' }),
      new UnitType({ id: UNIT_TYPE.CENTIMETERS, name: 'Centimeters' }),
    ];
  }
}
