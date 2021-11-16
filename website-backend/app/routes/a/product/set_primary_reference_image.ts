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
  (req: express.Request, res: express.Response) => {
    Product.findOne({
      where: { uid: req.body.uid },
    })
      .then(product => {
        if (product) {
          ProductReferenceImage.findByPk(req.body.primaryImageId)
            .then(image => {
              if (image) {
                image
                  .makePrimary()
                  .then(result => {
                    ProductReferenceImage.findAll({
                      where: { productId: product.id },
                      order: [['sortWeight', 'ASC']],
                    })
                      .then(images => {
                        res.json(images);
                      })
                      .catch((err: Error) =>
                        Errors.resJson(res, err, 'Error setting primary image'),
                      );
                  })
                  .catch((err: Error) =>
                    Errors.resJson(res, err, 'Error setting primary image'),
                  );
              }
            })
            .catch((err: Error) =>
              Errors.resJson(res, err, 'Error finding primary image'),
            );
        } else {
          throw new Error(`Unable to set the primary reference image of Product. Cannot find a Product with a uid of ${req.body.uid}.`);
        }
      })
      .catch((err: Error) =>
        Errors.resJson(res, err, 'Error finding product ' + req.body.uid),
      );
  },
);

module.exports = Router;
