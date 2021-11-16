// SPDX-License-Identifier: Apache-2.0
export interface AssetFileInterface {
  extension: string; // computed
  filename: string;
  id: number;
  size: number;
  sizeInMb: number; // computed
  typeId: number;

  getUrl(assetUid: string): string;
}

export default class AssetFile implements AssetFileInterface {
  extension: string = '';
  filename: string = '';
  id: number = 0;
  size: number = 0;
  sizeInMb: number = 0;
  typeId: number = 0;

  constructor(data: any) {
    if (data) {
      this.extension = data.filename.split('.').pop();
      this.filename = data.filename;
      this.id = data.id;
      this.size = data.size;
      this.sizeInMb = data.size / 1024 / 1024;
      this.typeId = data.typeId;
    }
  }

  getUrl(assetUid: string) {
    return 'https://cdn.3xr.com/models/' + assetUid + '/' + this.filename;
  }
}
