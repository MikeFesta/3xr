// SPDX-License-Identifier: Apache-2.0
export interface ProductAdditionalFileInterface {
  filename: string;
  id: number;
  url: string;
}

export default class ProductAdditionalFile implements ProductAdditionalFileInterface {
  filename: string = '';
  id: number = 0;
  url: string = '';

  constructor(data: any, productUid: string) {
    if (data) {
      this.filename = data.filename;
      this.id = data.id;
      this.url = 'https://x.3xr.com/x/products/' + productUid + '/reference/other/' + encodeURI(this.filename);
    }
  }
}
