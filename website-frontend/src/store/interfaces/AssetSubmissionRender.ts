// SPDX-License-Identifier: Apache-2.0
import Image, { ImageInterface } from '@/store/interfaces/common/Image';
export interface AssetSubmissionRenderInterface extends ImageInterface {
  filename: string;
  id: number;
}

export default class AssetSubmissionRender extends Image implements AssetSubmissionRenderInterface {
  filename: string = '';
  id: number = 0;

  constructor(data: any) {
    super(data);
    if (data) {
      this.alt = data.filename;
      this.filename = data.filename;
      this.id = data.id;
    }
  }
}
