// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { FileExtensionTypeAttributes, FileExtensionTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

export interface FileExtensionTypeInstance
  extends Model<FileExtensionTypeAttributes, FileExtensionTypeCreationAttributes>,
  FileExtensionTypeAttributes {}

type FileExtensionTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): FileExtensionTypeInstance;
};

export const FileExtensionType = sql.define(
  'file_extension_type',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['id', 'name'],
      },
    },
  },
) as FileExtensionTypeModelStatic;

export default FileExtensionType;
