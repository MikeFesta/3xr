// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Product } from '@models/product';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/:uid',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    Product.scope([{ method: ['isUserFavorite', req.user?.id || 0] }, 'details'])
      .findOne({
        where: { uid: req.params.uid },
      })
      .then((product: any) => {
        return res.json(product);
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Error getting product by uid');
      });
  },
);

module.exports = Router;
