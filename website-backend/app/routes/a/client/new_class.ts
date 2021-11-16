// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';
import { ClientClass } from '@models/client_class';
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
          ClientClass.create({
            clientId: client.id,
            name: req.body.name,
          })
            .then(clientClass => {
              // Return all classes
              ClientClass.findAll({
                order: [['name', 'ASC']],
                where: {
                  clientId: client.id,
                  deleted: false,
                },
              })
                .then(classes => {
                  res.json(classes);
                })
                .catch((err: Error) => {
                  res.json(err);
                });
            })
            .catch((err: Error) => {
              res.json(err);
            });
        } else {
          throw new Error(`Unable to define new Client Class. Cannot find a Client with an id of ${req.body.clientId}.`)
        }
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

module.exports = Router;
