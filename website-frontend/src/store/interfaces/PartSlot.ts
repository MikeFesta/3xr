// SPDX-License-Identifier: Apache-2.0
import { PartSlotAttributes } from '3xr_types';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';

export interface PartSlotInterface extends SequelizePicklistInterface, PartSlotAttributes { }

export default class PartSlot extends SequelizePicklist implements PartSlotInterface {
  // PartSlot Attributes
  slotName: string = '';
  partId: number = 0;

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.slotName = data.slotName;
      this.partId = data.partId;
    }
  }
}
