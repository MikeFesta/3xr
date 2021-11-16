// SPDX-License-Identifier: Apache-2.0
export interface AssetSpinSetInterface {
  angle: number;
  imageCount: number;
  resolution: number; // Max resolution (ie 2k), downsampled 1k and 512 are also created
}

export default class AssetSpinSet implements AssetSpinSetInterface {
  angle: number = 0;
  imageCount: number = 0;
  resolution: number = 0;

  constructor(data: any) {
    if (data) {
      this.angle = data.angle;
      this.imageCount = data.imageCount;
      this.resolution = data.resolution;
    }
  }
}
