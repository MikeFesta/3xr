// SPDX-License-Identifier: Apache-2.0
import * as moment from 'moment';
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { FaqI, FaqCreateI } from '@types';
import { User } from '@models/user';
import { sendMessageToOrganization } from '@root/mailer';
import { sql } from '@root/sql';

interface FaqInstance extends Model<FaqI, FaqCreateI>, FaqI {}

type FaqModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): FaqInstance;
  saveAskedQuestion(userId: number, title: string, question: string): Promise<any>;
  findAnsweredQuestions(): Promise<Sequelize.Model<FaqI, FaqCreateI>[]>;
  findQuestionsByUser(userId: number): Promise<Model<FaqI, FaqCreateI>[]>;
};

export const Faq = sql.define(
  'faq',
  {
    title: {
      type: Sequelize.STRING,
    },
    question: {
      type: Sequelize.TEXT,
    },
    answer: {
      type: Sequelize.TEXT,
    },
    askedByUserId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    answeredByUserId: {
      type: Sequelize.INTEGER,
    },
    answered: {
      type: Sequelize.BOOLEAN,
    },
    public: {
      type: Sequelize.BOOLEAN,
    },
    sortWeight: {
      type: Sequelize.INTEGER,
    },
  },
  {
    getterMethods: {
      createdAt: function (this: any) {
        const utc_date = moment.utc(this.getDataValue('createdAt')).toDate();
        return moment.tz(utc_date, 'America/New_York').format('h:mm:ssa MM/DD/YY');
      },
    },
  },
) as FaqModelStatic;

export default Faq;

Faq.saveAskedQuestion = (userId: number, title: string, question: string) => {
  return new Promise<void>((resolve, reject) => {
    Faq.create({
      title: title,
      question: question,
      askedByUserId: userId,
    })
      .then(result => {
        User.findByPk(userId)
          .then(user => {
            // Email Mike for now, perhaps post to Slack
            if (user) {
              sendMessageToOrganization(
                'mfesta@3xr.com',
                'FAQ Question',
                'user: ' + user.username + '; email: ' + user.email + '; title: ' + title + '; question: ' + question,
                '',
              )
                .then(mail_result => {
                  resolve();
                })
                .catch((err: Error) => {
                  // Ignore sending errors. the question was already recorded
                  resolve();
                });
            }
          })
          .catch((err: Error) => {
            reject(err);
          });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

Faq.findAnsweredQuestions = () => {
  return Faq.findAll({
    attributes: ['title', 'question', 'answer'],
    where: { answered: true, public: true },
    order: [['sortWeight', 'ASC']],
  });
};

Faq.findQuestionsByUser = (userId: number) => {
  return Faq.findAll({
    attributes: ['title', 'question', 'answered', 'answer', 'createdAt'],
    where: { askedByUserId: userId },
    order: [['sortWeight', 'ASC']],
  });
};

// Joins
Faq.hasOne(User, {
  as: 'askedByUser',
  foreignKey: 'id',
  sourceKey: 'askedByUserId',
});
Faq.hasOne(User, {
  as: 'answeredByUser',
  foreignKey: 'id',
  sourceKey: 'answeredByUserId',
});
