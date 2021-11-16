// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  User.forgotPassword(req.body.email)
    .then(result => {
      res.json('success');
    })
    .catch((err: Error) => {
      res.json(err);
    });
});

module.exports = Router;
