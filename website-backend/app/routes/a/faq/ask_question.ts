// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import ConnectEnsureLogin from 'connect-ensure-login';
import { Faq } from '@models/faq';
import { studioCors } from '@cors/studio';
const Router = express.Router();

Router.options('/', studioCors);
Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user?.id) {
      try {
        await Faq.saveAskedQuestion(req.user.id, req.body.title, req.body.question);
        res.json("Thanks for your question. We'll get back to you soon.");
      } catch (error) {
        res.json(error);
      }
    }
  },
);

module.exports = Router;
