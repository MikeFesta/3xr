// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Faq } from '@models/faq';
const Router = express.Router();

Router.options('/', studioCors);
Router.get('/', studioCors, (req: express.Request, res: express.Response) => {
  Faq.findAnsweredQuestions()
    .then(questions => {
      res.json(questions);
    })
    .catch((err: Error) => {
      res.json(err);
    });
});

module.exports = Router;
