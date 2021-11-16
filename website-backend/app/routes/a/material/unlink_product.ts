// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Material } from '@models/material';
import { Product } from '@models/product';
import Errors from '@root/errors';
import ProductMaterial from '@root/models/product_material';
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
      const material = await Material.findByPk(req.body.materialId);
      if (!material?.id) {
        Errors.resJson(res, null, 'Material not found');
      } else {
        const product = await Product.findByPk(req.body.productId);
        if (!product?.id) {
          Errors.resJson(res, null, 'Product not found');
        } else {
          try {
            const productMaterial = await ProductMaterial.findOne({
              where: {
                productId: product.id,
                materialId: material.id,
              }
            });
            await productMaterial?.destroy();
            res.json('success');
          } catch (err) {
            Errors.resJson(res, err as Error, 'Error Unlinking Material from Product');
          }
        }
      }
    }
  },
);

module.exports = Router;
