// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetSubmissionIssueImageAttributes, AssetSubmissionIssueImageCreattionAttributes } from '@types';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import { sql } from '@root/sql';

interface AssetSubmissionIssueImageInstance
  extends Model<AssetSubmissionIssueImageAttributes, AssetSubmissionIssueImageCreattionAttributes>,
  AssetSubmissionIssueImageAttributes {}

type AssetSubmissionIssueImageModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionIssueImageInstance;
};

export const AssetSubmissionIssueImage = sql.define(
  'asset_submission_issue_image',
  {
    assetSubmissionIssueId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    filename: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['assetSubmissionIssueId', 'filename', 'id'],
      },
    },
  },
) as AssetSubmissionIssueImageModelStatic;

export default AssetSubmissionIssueImage;

AssetSubmissionIssueImage.hasOne(AssetSubmissionIssue, {
  as: 'issue',
  foreignKey: 'id',
  sourceKey: 'assetSubmissionIssueId',
});
