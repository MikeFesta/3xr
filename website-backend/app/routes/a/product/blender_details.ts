// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Product } from '@models/product';
import Log from '@root/log';
const Router = express.Router();

Router.get('/', (req: express.Request, res: express.Response) => {
  return res.json('INVALID');
});

Router.post('/', (req: express.Request, res: express.Response) => {
  Product.getDataForBlenderPlugin(req.body.uid, req.body.api_token)
    .then(result => {
      return res.json(result);
    })
    .catch((err: Error) => {
      Log.error(
        'Error validating product for user by uid: ' +
        req.body.uid +
        ', token: ' +
        req.body.api_token,
      );
      Log.error(err.message);
      return res.json('error getting product by uid');
    });
});

module.exports = Router;
