// SPDX-License-Identifier: Apache-2.0
import IdName, { IdNameInterface } from '@/store/interfaces/common/IdName';

export interface FileTypeInterface extends IdNameInterface { }

export enum FILE_TYPE {
  UNKNOWN = 0,
  REFERENCE_IMAGE, // 1
  RENDER_JPG, // 2
  RENDER_PNG, // 3
  MODEL_USDZ, // 4
  MODEL_GLB, // 5
  QR, // 6
  SPIN_360, // 7
  SPIN_GIF, // 8
  SPIN_VIDEO, // 9
  SPIN_360_ZIP, // 10
  RENDER_ORTHOGRAPHIC_ZIP, // 11
  QR_ZIP, // = 12
  CRATE_AND_BARREL_ZIP, // = 13
}

export default class FileType extends IdName implements FileTypeInterface { }
