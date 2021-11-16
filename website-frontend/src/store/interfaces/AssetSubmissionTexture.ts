// SPDX-License-Identifier: Apache-2.0
import Image, { ImageInterface } from '@/store/interfaces/common/Image';
export interface AssetSubmissionTextureInterface extends ImageInterface {
  filename: string;
  src: string; // Computed
}

export default class AssetSubmissionTexture extends Image implements AssetSubmissionTextureInterface {
  filename: string = '';
  src: string = '';

  constructor(data: any, assetUid: string, submissionNumber: number) {
    super(data);
    if (data && assetUid && submissionNumber) {
      this.filename = data.filename;
      this.alt = data.filename;
      if (data.filename) {
        this.src = 'https://x.3xr.com/x/assets/' + assetUid + '/submissions/' + submissionNumber + '/' + data.filename;
      }
    }
  }
}
