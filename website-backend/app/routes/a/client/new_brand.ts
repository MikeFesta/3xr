// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';
import { ClientBrand } from '@models/client_brand';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);
Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    Client.findByPk(req.body.clientId)
      .then(client => {
        if (client) {
          ClientBrand.create({
            clientId: client.id,
            name: req.body.name,
          })
            .then(brand => {
              // Return all brands
              ClientBrand.findAll({
                order: [['name', 'ASC']],
                where: {
                  clientId: client.id,
                  deleted: false,
                },
              })
                .then(brands => {
                  res.json(brands);
                })
                .catch((err: Error) => {
                  res.json(err);
                });
            })
            .catch((err: Error) => {
              res.json(err);
            });
        } else {
          throw new Error(`Unable to create new Client Brand. Cannot find a Client with an id of ${req.body.clientId}.`)
        }
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

module.exports = Router;
