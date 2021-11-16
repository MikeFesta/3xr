// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Faq } from '@models/faq';
import { studioCors } from '@cors/studio';
const Router = express.Router();

Router.options('/', studioCors);
Router.get('/', studioCors, (req: express.Request, res: express.Response) => {
  if (!req.user) {
    res.json('[]');
  } else {
    Faq.findQuestionsByUser(req.user.id)
      .then(questions => {
        res.json(questions);
      })
      .catch((err: Error) => {
        res.json(err);
      });
  }
});

module.exports = Router;
