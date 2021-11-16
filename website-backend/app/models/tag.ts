// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Model } from 'sequelize';
import { TagAttributes, TagCreationAttributes } from '@types';
import { PermissionsLevelEnum } from '@enums';
import { PermissionsLevel } from '@models/permissions_level';
import { sql } from '@root/sql';

interface TagInstance extends Model<TagAttributes, TagCreationAttributes>, TagAttributes {}

type TagModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): TagInstance;
};

export const Tag = sql.define('tag', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  sort_weight: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  permissions_level_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: PermissionsLevelEnum.PUBLIC,
    unique: false,
  },
}) as TagModelStatic;

export default Tag;

import { Asset } from '@models/asset';
import { AssetTag } from '@models/asset_tag';

Tag.belongsToMany(Asset, {
  through: AssetTag,
});

Tag.belongsTo(PermissionsLevel);
