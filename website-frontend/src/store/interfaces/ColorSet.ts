// SPDX-License-Identifier: Apache-2.0
// COLORS (2/2)
// TODO: Keep this in sync with /src/styles/variables.scss (1/2)
// Note: This file changes /src/plugins/vuetify.ts

export default class ColorSet {
  // Default Colors
  black: string = '#000000';
  blue: string = '#0b82c5';
  darkBlue: string = '#1c5c87';
  darkGray: string = '#2d2d2d';
  gray: string = '#5d5d5d';
  green: string = '#1eac4d';
  lightBlue: string = '#4fa0d4';
  lightGray: string = '#f2f2f2';
  lightGreen: string = '#84d09d';
  lightPurple: string = '#aa97e1';
  orange: string = '#dda349';
  pink: string = '#f26e87';
  purple: string = '#7963ba';
  red: string = '#d82849';
  white: string = '#ffffff';

  constructor(name: string) {
    // Future expansion, load different color sets based on the theme name
  }
}
