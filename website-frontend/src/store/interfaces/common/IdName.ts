// SPDX-License-Identifier: Apache-2.0
// TODO: Replace this with Sequelize Picklist

export interface IdNameInterface {
  id: number;
  name: string;
  updateNameFromId(picklist: IdNameInterface[]): void;
}

export default class IdName implements IdNameInterface {
  id: number = 0; // For some child classes, this is changed to a custom type
  name: string = '';

  constructor(data: any) {
    if (data) {
      this.id = data.id;
      this.name = data.name;
    }
  }
  updateNameFromId(picklist: IdNameInterface[]) {
    for (let i = 0; i < picklist.length; i++) {
      if (picklist[i].id == this.id) {
        this.name = picklist[i].name;
      }
    }
  }
}
