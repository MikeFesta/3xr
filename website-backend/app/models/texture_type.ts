// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { TextureTypeAttributes, TextureTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface TextureTypeInstance
  extends Model<TextureTypeAttributes, TextureTypeCreationAttributes>,
  TextureTypeAttributes {}

type TextureTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): TextureTypeInstance;
};

export const TextureType = sql.define(
  'texture_type',
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
) as TextureTypeModelStatic;

export default TextureType;
