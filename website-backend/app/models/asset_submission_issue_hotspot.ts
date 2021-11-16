// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { AssetSubmissionIssueHotspotCreationAttributes, AssetSubmissionIssueHotspotAttributes } from '@types';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import { sql } from '@root/sql';

interface AssetSubmissionIssueHotspotInstance
  extends Model<AssetSubmissionIssueHotspotAttributes, AssetSubmissionIssueHotspotCreationAttributes>,
  AssetSubmissionIssueHotspotAttributes {}

type AssetSubmissionIssueHotspotModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetSubmissionIssueHotspotInstance;
};

export const AssetSubmissionIssueHotspot = sql.define(
  'asset_submission_issue_hotspot',
  {
    assetSubmissionIssueId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    normal: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    position: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['assetSubmissionIssueId', 'id', 'normal', 'position'],
      },
    },
  },
) as AssetSubmissionIssueHotspotModelStatic;

export default AssetSubmissionIssueHotspot;

AssetSubmissionIssueHotspot.hasOne(AssetSubmissionIssue, {
  as: 'issue',
  foreignKey: 'id',
  sourceKey: 'assetSubmissionIssueId',
});
