// SPDX-License-Identifier: Apache-2.0
import Image, { ImageInterface } from '@/store/interfaces/common/Image';
export interface ProductReferenceImageInterface extends ImageInterface {
  id: number;
  filename: string;
  primary: boolean;
  // TODO: see if we can passa product object with .uid in it
  productUid: string; // Technically stored as productId on the server, but UID is needed for urls
  sortWeight: number;
  src: string; // Computed
  fallbackImageUrl: string | null;
}

export default class ProductReferenceImage extends Image implements ProductReferenceImageInterface {
  alt: string = '';
  filename: string = '';
  id: number = 0;
  primary: boolean = false;
  productUid: string = '';
  sortWeight: number = 0;
  src: string = 'https://cdn.3xr.com/images/image_not_available.svg';
  fallbackImageUrl: string | null = null;

  constructor(data: any, productUid: string) {
    super(data);
    if (data) {
      this.alt = data.filename;
      this.filename = data.filename;
      this.id = data.id;
      this.primary = data.primary;
      this.productUid = productUid;
      this.sortWeight = data.sortWeight;
      this.src = data.src;
      // src
      if (this.filename && this.productUid) {
        this.src = 'https://x.3xr.com/x/products/' + this.productUid + '/reference/images/' + this.filename;
      } else if (data.fallbackImageUrl) {
        this.src = data.fallbackImageUrl;
      } else {
        this.src = 'https://cdn.3xr.com/images/image_not_available.svg';
      }
    }
  }
}
