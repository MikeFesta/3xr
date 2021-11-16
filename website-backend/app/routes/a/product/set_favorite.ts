// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Product } from '@models/product';
import ProductFavorite from '@root/models/product_favorite';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/user/login'),
  async (req: express.Request, res: express.Response) => {
    const product = await Product.findOne({ where: { uid: req.body.uid } });
    if (req.user?.id && product?.id) {
      if (req.body.set) {
        await ProductFavorite.create({
          userId: req.user.id,
          productId: product.id,
        });
      } else {
        // Unset Favorite (delete)
        const favorite = await ProductFavorite.findOne({
          where: { userId: req.user.id, productId: product.id },
        });
        if (favorite) {
          await favorite.destroy();
        }
      }
    }
    res.json('OK');
  },
);

module.exports = Router;
