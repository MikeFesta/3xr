// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Part } from '@models/part';
import { Product } from '@models/product';
import Errors from '@root/errors';
import ProductPart from '@root/models/product_part';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      const part = await Part.findByPk(req.body.partId);
      if (!part?.id) {
        Errors.resJson(res, null, 'Part not found');
      } else {
        const product = await Product.findByPk(req.body.productId);
        if (!product?.id) {
          Errors.resJson(res, null, 'Product not found');
        } else {
          try {
            const productPart = await ProductPart.findOne({
              where: {
                productId: product.id,
                partId: part.id,
              }
            });
            await productPart?.destroy();
            res.json('success');
          } catch (err) {
            Errors.resJson(res, err as Error, 'Error Unlinking Part from Product');
          }
        }
      }
    }
  },
);

module.exports = Router;
