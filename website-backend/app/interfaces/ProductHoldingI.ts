// SPDX-License-Identifier: Apache-2.0
import { UnitTypeEnum } from '@enums';
import { ProductHoldingTypeEnum } from './ProductHoldingTypeEnum';

export interface ProductHoldingCreationAttributes {
  bcProductId?: number;
  clientId: number;
  projectHoldingId?: number;
  productHoldingType: ProductHoldingTypeEnum;
  depth: number;
  height: number;
  width: number;
  name: string;
  description: string;
  partNumber?: string;
  sku?: string;
  unitTypeId: UnitTypeEnum;
  deleted: boolean;
}

export interface ProductHoldingAttributes extends ProductHoldingCreationAttributes {
  id: number;
}
