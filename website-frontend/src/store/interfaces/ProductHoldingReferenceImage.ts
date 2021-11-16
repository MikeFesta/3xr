// SPDX-License-Identifier: Apache-2.0
import { ProductHoldingReferenceImageAttributes } from '3xr_types';

export default class ProductHoldingReferenceImage implements ProductHoldingReferenceImageAttributes {
  id = 0;
  deleted = false;
  filename = '';
  bcProductId = 0;
  bcProductReferenceImageId = 0;
  imageLargeUrl = '';
  imageSmallUrl = '';
  productHoldingId = 0;
  primary = false;
  sortWeight = 0;
  constructor(data: ProductHoldingReferenceImageAttributes) {
    if (data) {
      this.filename = data.filename;
      this.bcProductId = data.bcProductId ? data.bcProductId : this.bcProductId;
      if (data.bcProductReferenceImageId) {
        this.bcProductReferenceImageId = data.bcProductReferenceImageId
      }
      this.bcProductReferenceImageId;
      this.imageLargeUrl = data.imageLargeUrl;
      this.imageSmallUrl = data.imageSmallUrl;
      this.productHoldingId = data.productHoldingId;
      this.primary = data.primary;
      this.sortWeight = data.sortWeight;
    }
  }
}
