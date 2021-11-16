// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Product } from '@models/product';
import { ProductReferenceImage } from '@models/product_reference_image';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/user/login'),
  async (req: express.Request, res: express.Response) => {
    try {
      const product = await Product.scope('withUnits').findOne({
        where: { uid: req.body.uid },
      });
      const image = await ProductReferenceImage.findByPk(req.body.imageId);
      if (product && image) {
        // @ts-ignore
        await image.remove(product.uid, req.user.id);
        const images = await ProductReferenceImage.findAll({
          where: { productId: product.id },
          order: [['sortWeight', 'ASC']],
        });
        await product.initAndZip();
        res.json(images);
      }
    } catch {
      Errors.resJson(res, null, 'Error finding product ' + req.body.uid);
    }
  },
);

module.exports = Router;
