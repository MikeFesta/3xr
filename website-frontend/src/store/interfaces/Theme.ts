// SPDX-License-Identifier: Apache-2.0
import ColorSet from '@/store/interfaces/ColorSet';

export interface ThemeInterface {
  name: string;
  color: ColorSet;
}

export default class Theme implements ThemeInterface {
  name: string = '';
  color: ColorSet = new ColorSet('default');

  constructor(name: string) {
    this.name = name;
    // Future expansion, load different color sets based on the theme name
  }
}
