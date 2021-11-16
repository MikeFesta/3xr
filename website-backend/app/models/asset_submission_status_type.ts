// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetSubmissionStatusTypeAttributes, AssetSubmissionStatusTypeCreationAttributes } from '@types';
import { sql } from '@root/sql';

interface AssetSubmissionStatusTypeInstance
  extends Model<AssetSubmissionStatusTypeAttributes, AssetSubmissionStatusTypeCreationAttributes>,
  AssetSubmissionStatusTypeAttributes {}

type AssetSubmissionStatusTypeModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionStatusTypeInstance;
};

export const AssetSubmissionStatusType = sql.define(
  'asset_submission_status_type',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    resubmissionAllowed: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['id', 'name', 'resubmissionAllowed'],
      },
    },
  },
) as AssetSubmissionStatusTypeModelStatic;

export default AssetSubmissionStatusType;
