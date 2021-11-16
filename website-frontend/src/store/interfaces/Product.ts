// SPDX-License-Identifier: Apache-2.0
import { ProductAttributes } from '3xr_types';
import Asset, { AssetInterface } from '@/store/interfaces/Asset';
import Material, { MaterialInterface } from '@/store/interfaces/Material';
import Part, { PartInterface } from '@/store/interfaces/Part';
import ProductAdditionalFile, { ProductAdditionalFileInterface } from '@/store/interfaces/ProductAdditionalFile';
import ProductReferenceImage, { ProductReferenceImageInterface } from '@/store/interfaces/ProductReferenceImage';
import SequelizePicklist, { SequelizePicklistInterface } from '@/store/interfaces/common/SequelizePicklist';
import UnitType, { UnitTypeInterface } from '@/store/interfaces/types/UnitType';
import User, { UserInterface } from '@/store/interfaces/User';

export interface ProductInterface extends SequelizePicklistInterface, ProductAttributes {
  // children
  additionalFiles: Array<ProductAdditionalFileInterface>;
  artist: UserInterface;
  asset: AssetInterface;
  favorites: Array<any>;
  job: any; // Circular Dependancy, so not referencing JobInterface (for now)
  materials: Array<MaterialInterface>;
  parts: Array<PartInterface>;
  referenceImages: Array<ProductReferenceImageInterface>;
  units: UnitTypeInterface;

  // computed
  depthInMeters: number;
  heightInMeters: number;
  primaryImage: string;
  urlTruncated: string;
  widthInMeters: number;

  // functions
  setAdditionalFiles(additionalFiles: Array<ProductAdditionalFileInterface>): void;
  setMaterials(materials: Array<MaterialInterface>): void;
  setParts(parts: Array<PartInterface>): void;
  setReferenceImages(referenceImages: Array<ProductReferenceImageInterface>): void;
}

export interface ProducUpdatetImageInterface {
  uid: string;
  primaryImageId: number;
}

export interface ProductDeleteImageInterface {
  uid: string;
  imageId: number;
}

export interface ProductDeleteAdditionalImageInterface {
  uid: string;
  additionalFileId: number;
}

export default class Product extends SequelizePicklist implements ProductInterface {
  // ProductAttributes
  artistUserId: number = 0;
  asin: string = '';
  blendName: string = '';
  depth: number = 0;
  height: number = 0;
  partNumber: string = '';
  uid: string = '';
  url: string = '';
  width: number = 0;

  // children
  additionalFiles: Array<ProductAdditionalFileInterface> = [];
  artist: UserInterface = new User(null);
  asset: AssetInterface = new Asset(null);
  favorites: Array<any> = [];
  job: any = null; // Circular Dependanc = null, //emptyJob, Cyclic dependancy here, causing a deployment error
  materials: Array<MaterialInterface> = [];
  parts: Array<PartInterface> = [];
  referenceImages: Array<ProductReferenceImageInterface> = [];
  units: UnitTypeInterface = new UnitType(null);

  // computed
  depthInMeters: number = 0;
  heightInMeters: number = 0;
  primaryImage: string = '';
  urlTruncated: string = '';
  widthInMeters: number = 0;

  constructor(data: any) {
    super(data); // id, name, createdAt, updatedAt
    if (data) {
      this.artistUserId = data.artistUserId;
      this.asin = data.asin;
      this.blendName = data.blendName;
      this.depth = data.depth;
      this.height = data.height;
      this.partNumber = data.partNumber;
      this.uid = data.uid;
      if (data.url) {
        if (data.url.substr(0, 4) != 'http') {
          this.url = 'http://' + data.url;
        } else {
          this.url = data.url;
        }
      }
      this.width = data.width;
      this.setAdditionalFiles(data.additionalFiles);
      this.artist = new User(data.artist);
      this.asset = new Asset(data.asset);
      this.favorites = data.favorites;
      this.job = data.job; // //product.job = jobFromDb(data.job); // circular
      this.setMaterials(data.materials);
      this.setParts(data.parts);
      if (data.referenceImages && data.referenceImages.length > 0) {
        const firstReferenceImage = data.referenceImages[0];
        if (firstReferenceImage && firstReferenceImage.filename) {
          this.primaryImage =
            'https://x.3xr.com/x/products/' + data.uid + '/reference/images/' + firstReferenceImage.filename;
        } else if (
          firstReferenceImage &&
          firstReferenceImage.fallbackImageUrl &&
          firstReferenceImage.fallbackImageUrl.length > 0
        ) {
          this.primaryImage = firstReferenceImage.fallbackImageUrl;
        } else {
          // Should not reach here!
          this.primaryImage = 'https://cdn.3xr.com/images/image_not_available.svg';
        }
        this.setReferenceImages(data.referenceImages);
      } else {
        if (this.asset.published) {
          this.primaryImage = 'https://cdn.3xr.com/models/' + this.asset.uid + '/' + this.asset.name + '-2k.png';
        } else {
          this.primaryImage = 'https://cdn.3xr.com/images/image_not_available.svg';
        }
      }
      this.units = new UnitType(data.units);
      if (data.url && data.url.length > 32) {
        this.urlTruncated = data.url.substr(0, 29) + '...';
      } else {
        this.urlTruncated = data.url;
      }
      this.depthInMeters = this.units.convertToMeters(data.depth);
      this.heightInMeters = this.units.convertToMeters(data.height);
      this.widthInMeters = this.units.convertToMeters(data.width);
    }
  }
  setAdditionalFiles(additionalFiles: Array<ProductAdditionalFileInterface>) {
    this.additionalFiles = [];
    if (additionalFiles) {
      additionalFiles.forEach((additionalFile: ProductAdditionalFileInterface) => {
        this.additionalFiles.push(new ProductAdditionalFile(additionalFile, this.uid));
      });
    }
  }
  setMaterials(materials: Array<MaterialInterface>) {
    this.materials = [];
    if (materials) {
      materials.forEach((material: MaterialInterface) => {
        this.materials.push(new Material(material));
      });
    }
  }
  setParts(parts: Array<PartInterface>) {
    this.parts = [];
    if (parts) {
      parts.forEach((part: PartInterface) => {
        this.parts.push(new Part(part));
      });
    }
  }
  setReferenceImages(referenceImages: Array<ProductReferenceImageInterface>) {
    this.referenceImages = [];
    if (referenceImages) {
      referenceImages.forEach((referenceImage: ProductReferenceImageInterface) => {
        this.referenceImages.push(new ProductReferenceImage(referenceImage, this.uid));
      });
    }
  }
}
