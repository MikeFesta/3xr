// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { FileTypeAttributes, FileTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface FileTypeInstance extends Model<FileTypeAttributes, FileTypeCreationAttributes>, FileTypeAttributes {}

type FileTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): FileTypeInstance;
};

export const FileType = sql.define('asset_file_type', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}) as FileTypeModelStatic;

export default FileType;
