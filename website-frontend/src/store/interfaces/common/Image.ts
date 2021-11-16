// SPDX-License-Identifier: Apache-2.0
export interface ImageInterface {
  alt: string;
  src: string;
  // TODO: additional image info
  // File format
  // File size (?)
  // Height
  // Levels of Detail (?)
  // Width
}

export default class Image implements ImageInterface {
  alt: string = '';
  src: string = 'https://cdn.3xr.com/images/image_not_available.svg';

  constructor(data: any) {
    if (data) {
      this.alt = data.alt;
      if (data.src) {
        this.src = data.src;
      }
    } else {
      this.src = 'https://cdn.3xr.com/images/image_not_available.svg';
    }
  }
}
