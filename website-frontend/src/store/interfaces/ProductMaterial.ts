// SPDX-License-Identifier: Apache-2.0
import SequelizeModel, { SequelizeModelInterface } from '@/store/interfaces/common/SequelizeModel';

export interface ProductMaterialInterface extends SequelizeModelInterface {
  slotName: string;
}

export default class ProductMaterial extends SequelizeModel implements ProductMaterialInterface {
  slotName: string = '';

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.slotName = data.slotName;
    }
  }
}
