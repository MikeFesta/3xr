// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { sql } from '@root/sql';
import { AssetSubmissionRenderAttributes, AssetSubmissionRenderCreationAttributes } from '@types';

import Errors from '@root/errors';

interface AssetSubmissionRenderInstance
  extends Model<AssetSubmissionRenderAttributes, AssetSubmissionRenderCreationAttributes>,
  AssetSubmissionRenderAttributes {}

type AssetSubmissionRenderModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionRenderInstance;
  recordArray(assetSubmissionId: number, renders: Array<string>): Promise<any>;
};

export const AssetSubmissionRender = sql.define(
  'asset_submission_render',
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
  },
) as AssetSubmissionRenderModelStatic;

export default AssetSubmissionRender;

// Additional Includes
import { AssetSubmission } from '@models/asset_submission';

AssetSubmissionRender.recordArray = (assetSubmissionId: number, renders: Array<string>) => {
  return new Promise<void>(async (resolve, reject) => {
    const t: Array<any> = [];
    for (let i = 0; i < renders.length; i++) {
      // Filename needs to be unique, so omit if there is already a record
      try {
        const duplicate = await AssetSubmissionRender.findOne({
          where: {
            assetSubmissionId: assetSubmissionId,
            filename: renders[i],
          },
        });
        if (!duplicate) {
          t.push({
            assetSubmissionId: assetSubmissionId,
            filename: renders[i],
          });
        }
      } catch {
        reject();
      }
    }
    return AssetSubmissionRender.bulkCreate(t)
      .then((result: any) => {
        resolve();
      })
      .catch((err: Error) => {
        Errors.reject(reject, err, 'error inserting renders array into asset_submission_renders');
      });
  });
};

AssetSubmissionRender.hasOne(AssetSubmission, {
  as: 'asset_submission',
  foreignKey: 'id',
  sourceKey: 'assetSubmissionId',
});
