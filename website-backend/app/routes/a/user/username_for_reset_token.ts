// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  User.getUserForPasswordResetToken(req.body.token)
    .then(user => {
      res.json(user.username);
    })
    .catch((err: Error) => {
      res.json('INVALID LINK');
    });
});

module.exports = Router;
