// SPDX-License-Identifier: Apache-2.0
export interface IPurchaseOrderRequest {
  artistId: number;
  brandId: number;
  classId: number;
  clientId: number;
  dateDue: string;
  defaultPrice: number;
  name: string;
  studioId: number;
  unitTypeId: number;
  uid?: string;
}


export interface IPurchaseOrderImportHoldingRequest {
  artistId: number;
  brandId: number;
  classId: number;
  clientId: number;
  dateDue: string;
  name: string;
  priorityId: number;
  qualityId: number;
  unitTypeId: number;
  projectHoldingId: number;
}
