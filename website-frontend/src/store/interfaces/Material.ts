// SPDX-License-Identifier: Apache-2.0
import { MaterialAttributes } from '3xr_types';
import { BlendModeEnum } from '3xr_types/enums';
import { numberToTwoDigitHex } from '@/helpers';
import Product, { ProductInterface } from '@/store/interfaces/Product';
import ProductMaterial, { ProductMaterialInterface } from '@/store/interfaces/ProductMaterial';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';

export interface MaterialInterface extends SequelizePicklistInterface, MaterialAttributes {
  // children
  productMaterial: ProductMaterialInterface;
  products: Array<ProductInterface>;

  // computed
  blendDownloadUrl: string;
  hexString: string;
  thumbnailUrl: string;
}

export default class Material extends SequelizePicklist implements MaterialInterface {
  // Material Attributes
  blendMode: number = BlendModeEnum.OPAQUE;
  blendName: string = '';
  diffuseRedValue: number = 0;
  diffuseGreenValue: number = 0;
  diffuseBlueValue: number = 0;
  mappingScaleValue: number = 1;
  metallicValue: number = 0;
  normalStrengthValue: number = 1;
  roughnessValue: number = 1;
  uid: string = '';

  // children
  productMaterial: ProductMaterialInterface = new ProductMaterial(null);
  products: Array<ProductInterface> = [];

  // computed
  blendDownloadUrl: string = '';
  hexString: string = '000000';
  thumbnailUrl: string = '';

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.blendDownloadUrl = 'x/materials/' + data.uid + '/blender/' + data.blendName + '.blend';
      this.blendMode = data.blendMode;
      this.blendName = data.blendName;
      this.diffuseRedValue = data.diffuseRedValue;
      this.diffuseGreenValue = data.diffuseGreenValue;
      this.diffuseBlueValue = data.diffuseBlueValue;
      this.hexString =
        numberToTwoDigitHex(data.diffuseRedValue) +
        numberToTwoDigitHex(data.diffuseGreenValue) +
        numberToTwoDigitHex(data.diffuseBlueValue);
      this.mappingScaleValue = data.mappingScaleValue;
      this.metallicValue = data.metallicValue;
      this.normalStrengthValue = data.normalStrengthValue;
      this.productMaterial = new ProductMaterial(data.product_material); // optional, comes from product/details
      this.setProducts(data.products);
      this.roughnessValue = data.roughnessValue;
      this.thumbnailUrl = 'https://x.3xr.com/x/materials/' + data.uid + '/final/' + data.blendName + '-256.jpg';
      this.uid = data.uid;
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
}
