// SPDX-License-Identifier: Apache-2.0
import { PartAttributes } from '3xr_types';
import PartSlot, { PartSlotInterface } from '@/store/interfaces/PartSlot';
import Product, { ProductInterface } from '@/store/interfaces/Product';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';

export interface PartInterface extends SequelizePicklistInterface, PartAttributes {
  // children
  products: Array<ProductInterface>;
  slots: Array<PartSlotInterface>;

  // computed
  blendDownloadUrl: string;
  thumbnailUrl: string;

  // functions
  setProducts(products: Array<ProductInterface>): void;
  setSlots(slots: Array<PartSlotInterface>): void;
}

export default class Part extends SequelizePicklist implements PartInterface {
  // PartAttributes
  blendName: string = '';
  createdFromSubmissionId: number = 0;
  uid: string = '';

  // children
  products: Array<ProductInterface> = [];
  slots: Array<PartSlotInterface> = [];

  // computed
  blendDownloadUrl: string = '';
  thumbnailUrl: string = '';

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.blendName = data.blendName;
      this.createdFromSubmissionId = data.createdFromSubmissionId;
      this.uid = data.uid;

      this.setProducts(data.products);
      this.setSlots(data.slots);

      this.blendDownloadUrl = 'x/parts/' + data.uid + '/blender/' + data.blendName + '.blend';
      this.thumbnailUrl = 'https://x.3xr.com/x/parts/' + data.uid + '/final/' + data.blendName + '-256.jpg';
    }
  }
  setProducts(products: Array<ProductInterface>) {
    this.products = [];
    if (products) {
      products.forEach((product: any) => {
        this.products.push(new Product(product));
      });
    }
  }
  setSlots(slots: Array<PartSlotInterface>) {
    this.slots = [];
    if (slots) {
      slots.forEach((slot: any) => {
        this.slots.push(new PartSlot(slot));
      });
    }
  }
}
