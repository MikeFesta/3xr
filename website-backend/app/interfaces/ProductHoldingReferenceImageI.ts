// SPDX-License-Identifier: Apache-2.0
export interface ProductHoldingReferenceImageCreationAttributes {
  filename: string;
  bcProductId?: number;
  bcProductReferenceImageId?: number;
  imageLargeUrl: string;
  imageSmallUrl: string;
  productHoldingId: number;
  primary: boolean;
  sortWeight: number;
}

export interface ProductHoldingReferenceImageAttributes extends ProductHoldingReferenceImageCreationAttributes {
  id: number;
  deleted: boolean;
}
