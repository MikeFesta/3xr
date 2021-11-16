// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Product } from '@models/product';

import Log from '@root/log';
const Router = express.Router();

Router.post('/', (req: express.Request, res: express.Response) => {
  Product.readyToSubmit(req.body.uid, req.body.apiToken)
    .then(ready => {
      return res.json(ready);
    })
    .catch((err: Error) => {
      Log.error(
        'Error getting product submission status by uid' + req.params.uid,
      );
      Log.error(err.message);
      return res.json(false);
    });
});

module.exports = Router;
