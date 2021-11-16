// SPDX-License-Identifier: Apache-2.0
import { ProductHoldingAttributes, ProductHoldingReferenceImageAttributes } from '3xr_types';
import ProductHoldingReferenceImage from './ProductHoldingReferenceImage';

interface IProductHolding {
  id: number;
  name: string;
  sku: string;
  description: string;
  width: number;
  height: number;
  depth: number;
  referenceImages: ProductHoldingReferenceImageAttributes[];
}

export default class ProductHolding implements IProductHolding {
  id = 0;
  name = '';
  sku = '';
  description = '';
  width = 0;
  height = 0;
  depth = 0;
  referenceImages: ProductHoldingReferenceImageAttributes[] = [];
  constructor(data: ProductHoldingAttributes) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
      this.sku = data.sku || '';
      this.description = data.description;
      this.width = data.width;
      this.height = data.height;
      this.depth = data.depth;
      if (Array.isArray(data.referenceImages)) {
        this.referenceImages = data.referenceImages.map(referenceImage => {
          return new ProductHoldingReferenceImage(referenceImage);
        });
      }
    }
  }
}
