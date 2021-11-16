// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Product } from '@models/product';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    // Favorites is currently an admin-only feature
    if (req.user?.admin) {
      const products = await Product.scope([
        { method: ['card', req.user.id] },
        { method: ['favoritesForUser', req.user?.id] },
      ]).findAll();
      res.json(products);
    } else {
      res.status(403).send('Unauthorized');
    }
  },
);

module.exports = Router;
