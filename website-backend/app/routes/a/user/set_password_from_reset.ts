// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
import Log from '@root/log';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  User.getUserForPasswordResetToken(req.body.token)
    .then(user => {
      user.setPassword(req.body.password)
        .then(result => {
          if (result) {
            res.json(user.getUserInfoForStudioLogin());
          } else {
            Log.error('Unable to set password for user ' + user.username);
            res.json('Unable to set password');
          }
        })
        .catch((err: Error) => {
          Log.error('Unable to set password');
          res.json('Unable to set password');
        });
    })
    .catch((err: Error) => {
      res.json('Invalid Token');
    });
});

module.exports = Router;
