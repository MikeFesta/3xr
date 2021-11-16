// SPDX-License-Identifier: Apache-2.0
export interface ProductData {
  depth: number;
  height: number;
  width: number;
  name: string;
  product_uid: string;
  unit_type: string;
}

interface Dimensions {
  additional: string;
  depth?: number;
  height?: number;
  width?: number;
  unitTypeId: number;
}

interface ProductDetailsTableInput {
  asin: string;
  brandId: number;
  classId: number;
  dateDue: string;
  dimensions: Dimensions;
  materialInformation: string;
  modelingInstructions: string;
  name: string;
  notes: string;
  partNumber: string;
  price: number;
  priority: number;
  projectUid: string;
  quality: number;
  studioId: number;
  url: string;
  blendName: string;
  uid: string;
}

export interface ProductDetailsTableData {
  saving: boolean;
  isEditEnabled: boolean;
  errorMessage: string;
  successMessage: string;
  input: ProductDetailsTableInput;
}
