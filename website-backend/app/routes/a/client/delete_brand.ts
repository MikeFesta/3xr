// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { ClientBrand } from '@models/client_brand';
import Log from '@root/log';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    ClientBrand.findByPk(req.body.brandId)
      .then(brand => {
        if (brand) {
          brand.deleted = true;
          brand
            .save()
            .then(saved => {
              // Return all brands
              ClientBrand.findAll({
                order: [['name', 'ASC']],
                where: {
                  clientId: brand.clientId,
                  deleted: false,
                },
              })
                .then(brands => {
                  res.json(brands);
                })
                .catch((err: Error) => {
                  Log.error('no brands found');
                  Log.error(err);
                  res.json(err);
                });
            })
            .catch((err: Error) => {
              res.json(err);
            });
        } else {
          throw new Error(`Unable to delete Brand. Cannot find a Brand with an id of ${req.body.brandId}.`)
        }
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

module.exports = Router;
