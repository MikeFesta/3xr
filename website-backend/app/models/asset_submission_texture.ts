// SPDX-License-Identifier: Apache-2.0
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { sql } from '@root/sql';
import { AssetSubmissionTextureAttributes, AssetSubmissionTextureCreationAttributes } from '@types';

interface AssetSubmissionTextureInstance
  extends Model<AssetSubmissionTextureAttributes, AssetSubmissionTextureCreationAttributes>,
  AssetSubmissionTextureAttributes {}

type AssetSubmissionTextureModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionTextureInstance;
  recordTexture(
    assetSubmissionId: number,
    filename: string,
  ): Promise<Model<AssetSubmissionTextureAttributes, AssetSubmissionTextureCreationAttributes>[]>;
  recordArray(assetSubmissionId: number, textures: Array<string>): Promise<void>;
};

export const AssetSubmissionTexture = sql.define(
  'asset_submission_texture',
  {
    assetSubmissionId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['assetSubmissionId', 'filename'],
      },
    ],
    scopes: {
      basic: {
        attributes: ['id', 'filename'],
      },
    },
  },
) as AssetSubmissionTextureModelStatic;

export default AssetSubmissionTexture;

// Additional Includes
import { AssetSubmission } from '@models/asset_submission';

AssetSubmissionTexture.recordTexture = (assetSubmissionId: number, filename: string) => {
  return new Promise((resolve: Function, reject: Function) => {
    AssetSubmissionTexture.create({
      assetSubmissionId: assetSubmissionId,
      filename: filename,
    })
      .then((result: any) => {
        resolve();
      })
      .catch((err: Error) => {
        // Duplicates throw an error, but we still want to process the rest
        resolve();
      });
  });
};

AssetSubmissionTexture.recordArray = (assetSubmissionId: number, textures: Array<string>) => {
  return new Promise((resolve, reject) => {
    if (textures.length == 0) {
      // No records to insert
      resolve();
    } else {
      const recordTexturesRecursiveFunction = (i: number) => {
        if (i >= textures.length) {
          resolve();
        } else {
          AssetSubmissionTexture.recordTexture(assetSubmissionId, textures[i])
            .then((result: any) => {
              recordTexturesRecursiveFunction(i + 1);
            })
            .catch((err: Error) => {
              reject();
            });
        }
      };
      recordTexturesRecursiveFunction(0);
    }
  });
};

AssetSubmissionTexture.hasOne(AssetSubmission, {
  as: 'asset_submission',
  foreignKey: 'id',
  sourceKey: 'assetSubmissionId',
});
