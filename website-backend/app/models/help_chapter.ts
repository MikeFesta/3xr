// SPDX-License-Identifier: Apache-2.0
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { HelpChapterAttributes, HelpChapterCreationAttributes } from '@types';
import { HelpChapterSection } from '@models/help_chapter_section';
import { sql } from '@root/sql';

interface HelpChapterInstance
  extends Model<HelpChapterAttributes, HelpChapterCreationAttributes>,
  HelpChapterAttributes {}

type HelpChapterModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): HelpChapterInstance;
  findAllForStudio(): Promise<Model<HelpChapterAttributes, HelpChapterCreationAttributes>[]>;
};

export const HelpChapter = sql.define('help_chapter', {
  title: {
    type: Sequelize.STRING,
  },
  icon: {
    type: Sequelize.STRING,
  },
  sortWeight: {
    type: Sequelize.INTEGER,
  },
}) as HelpChapterModelStatic;

export default HelpChapter;

// Joins
HelpChapter.hasMany(HelpChapterSection, {
  as: 'sections',
  foreignKey: 'helpChapterId',
  sourceKey: 'id',
});

HelpChapter.findAllForStudio = () => {
  return HelpChapter.findAll({
    attributes: ['id', 'title', 'icon'],
    include: [
      {
        attributes: ['id', 'title', 'content', 'sortWeight'],
        model: HelpChapterSection,
        as: 'sections',
      },
    ],
    order: [
      [Sequelize.col('help_chapter.sort_weight'), 'ASC'],
      [Sequelize.col('sections.sort_weight'), 'ASC'],
    ],
  });
};
