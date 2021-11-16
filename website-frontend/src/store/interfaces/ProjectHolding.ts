// SPDX-License-Identifier: Apache-2.0
import { ProjectHoldingAttributes } from '3xr_types';
import ProductHolding from './ProductHolding';

export default class ProjectHolding implements ProjectHoldingAttributes {
  id: number = 0;
  clientId: number = 0;
  defaultUnitType: number = 0;
  name: string = '';
  deleted: boolean = false;
  productHoldings: ProjectHolding[] = [];
  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.clientId = data.clientId;
      this.name = data.name;
      this.deleted = data.deleted;
      if (Array.isArray(data.productHoldings)) {
        this.productHoldings = data.productHoldings.map((productHolding: any) => {
          return new ProductHolding(productHolding);
        });
      }
    }
  }
}