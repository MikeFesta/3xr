// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Errors from '@root/errors';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  if (!req.user?.admin) {
    Errors.resJson(res, null, 'Admin Only');
  } else {
    User.findByPk(req.user.id)
      .then((user: any) => {
        const primaryRoleId = parseInt(req.body.primaryRoleId);
        user.primaryRoleId = primaryRoleId;
        return user.save();
      })
      .then((save: any) => {
        res.json('success');
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Error setting primary role');
      });
  }
});

module.exports = Router;
