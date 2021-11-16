// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Product } from '@models/product';
import { ProductAdditionalFile } from '@models/product_additional_file';
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
      const additionalFile = await ProductAdditionalFile.findByPk(req.body.additionalFileId);
      if (product && additionalFile && req.user) {
        if (product.artistUserId != req.user?.id && !req.user?.admin) {
          Errors.resJson(res, null, 'You are not authorized to delete files from this product');
        } else {
          await additionalFile.remove(product.uid, req.user.id);
          const additionalFiles = await ProductAdditionalFile.findAll({
            where: { productId: product.id },
            order: [['sortWeight', 'ASC']],
          });
          res.json(additionalFiles);
        }
      } else {
        throw new Error();
      }
    } catch {
      Errors.resJson(res, null, 'Error deleting additional file for product ' + req.body.uid);
    }
  },
);

module.exports = Router;
