// SPDX-License-Identifier: Apache-2.0
import { DEVICE_TYPE } from '@/store/interfaces/types/DeviceType';

export default interface Xr {
  deviceType: DEVICE_TYPE;
  sessionId: string;
}

export const emptyXr: Xr = {
  deviceType: DEVICE_TYPE.UNKNOWN,
  sessionId: '',
};
