// SPDX-License-Identifier: Apache-2.0
import SequelizeModel, { SequelizeModelInterface } from '@/store/interfaces/common/SequelizeModel';

export interface SequelizePicklistInterface extends SequelizeModelInterface {
  name: string;
  updateNameFromId(picklist: SequelizePicklistInterface[]): void;
}

export default class SequelizePicklist extends SequelizeModel implements SequelizePicklistInterface {
  name: string = '';

  constructor(data: any) {
    super(data); // id, createdAt, updatedAt
    if (data) {
      this.name = data.name;
    }
  }
  updateNameFromId(picklist: SequelizePicklistInterface[]) {
    for (let i = 0; i < picklist.length; i++) {
      if (picklist[i].id == this.id) {
        this.name = picklist[i].name;
      }
    }
  }
}
