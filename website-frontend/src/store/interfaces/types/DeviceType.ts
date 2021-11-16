// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface DeviceTypeInterface extends IdNameInterface { }

export enum DEVICE_TYPE {
  UNKNOWN = 0,
  IOS,
  ANDROID,
  DESKTOP,
}

export default class DeviceType extends IdName implements DeviceTypeInterface { }
