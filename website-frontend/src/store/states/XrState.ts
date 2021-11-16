// SPDX-License-Identifier: Apache-2.0
import { DEVICE_TYPE } from '@/store/interfaces/types/DeviceType';
import Xr, { emptyXr } from '@/store/interfaces/Xr';

export interface XrState {
  xr: Xr;
}

export default {
  namespaced: true as true,
  state: {
    xr: emptyXr,
  } as XrState,
  mutations: {
    CHECK_DEVICE_TYPE(state: XrState) {
      if (document.createElement('a').relList.supports('ar')) {
        // iOS
        state.xr.deviceType = DEVICE_TYPE.IOS;
      } else if (/Android/i.test(navigator.userAgent)) {
        // Android
        state.xr.deviceType = DEVICE_TYPE.ANDROID;
      } else {
        // Web (default)
        state.xr.deviceType = DEVICE_TYPE.DESKTOP;
      }
    },
    GENERATE_SESSION_ID(state: XrState) {
      state.xr.sessionId =
        +new Date() +
        Math.random()
          .toString(36)
          .substring(2);
    },
  },
  getters: {
    device: (state: XrState) => state.xr.deviceType,
    session: (state: XrState) => state.xr.sessionId,
  },
  actions: {},
};
