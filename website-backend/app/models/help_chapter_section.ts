// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions } from 'sequelize';
import { HelpChapterSectionAttributes, HelpChapterSectionCreationAttributes } from '@types';
import { User } from '@models/user';
import { sql } from '@root/sql';
import { Model } from 'sequelize';

import Log from '@root/log';

interface HelpChapterSectionInstance
  extends Model<HelpChapterSectionAttributes, HelpChapterSectionCreationAttributes>,
  HelpChapterSectionAttributes {}

type HelpChapterSectionModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): HelpChapterSectionInstance;
  getActiveSubscribers(): Promise<{ subscribers: any }>;
  addNewSection(
    userId: number,
    title: string,
    content: string,
    chapterId: number,
    sortWeight: number,
  ): Promise<Model<HelpChapterSectionAttributes, HelpChapterSectionCreationAttributes>>;
  saveEdits(
    id: number,
    userId: number,
    title: string,
    content: string,
  ): Promise<[number, Model<HelpChapterSectionAttributes, HelpChapterSectionCreationAttributes>[]]>;
  findAllForChapter(
    chapterId: number,
  ): Promise<Model<HelpChapterSectionAttributes, HelpChapterSectionCreationAttributes>[]>;
};

export const HelpChapterSection = sql.define('help_chapter_section', {
  title: {
    type: Sequelize.STRING,
  },
  content: {
    type: Sequelize.TEXT,
  },
  latestUserId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  helpChapterId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  sortWeight: {
    type: Sequelize.INTEGER,
  },
}) as HelpChapterSectionModelStatic;

HelpChapterSection.addNewSection = (
  userId: number,
  title: string,
  content: string,
  chapterId: number,
  sortWeight: number,
) => {
  Log.debug('creating new section');
  return HelpChapterSection.create({
    title: title,
    content: content,
    latestUserId: userId,
    helpChapterId: chapterId,
    sortWeight: sortWeight,
  });
};

HelpChapterSection.saveEdits = (id: number, userId: number, title: string, content: string) => {
  return HelpChapterSection.update({ content: content, title: title, latestUserId: userId }, { where: { id: id } });
};

HelpChapterSection.findAllForChapter = (chapterId: number) => {
  return HelpChapterSection.findAll({
    attributes: ['id', 'title', 'content'],
    where: { helpChapterId: chapterId },
    order: [['sortWeight', 'ASC']],
  });
};

// Joins
HelpChapterSection.hasOne(User, {
  as: 'latestUser',
  foreignKey: 'id',
  sourceKey: 'latestUserId',
});

export default HelpChapterSection;
