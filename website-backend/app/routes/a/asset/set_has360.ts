// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { internalOnlyFilter } from '@access/internal_only';
import { Asset } from '@models/asset';
import Errors from '@root/errors';
import Log from '@root/log';
const Router = express.Router();

Router.post('/', internalOnlyFilter, (req: express.Request, res: express.Response) => {
  Asset.findOne({ where: { uid: req.body.uid } })
    .then((asset: any) => {
      Log.debug('HAS 360 is no longer in use, use the asset_spinsets table')
      return asset.save();
    })
    .then((saveResult: any) => {
      res.json('success');
    })
    .catch((err: Error) => {
      Errors.resJson(res, err, 'Error getting asset by uid');
    });
});

module.exports = Router;
