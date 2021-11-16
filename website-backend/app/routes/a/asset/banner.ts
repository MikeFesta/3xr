// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Asset } from '@models/asset';
import Errors from '@root/errors';
import helpers from '@root/helpers';
const Router = express.Router();

Router.options('/', studioCors);

Router.get('/:uid', studioCors, async (req: express.Request, res: express.Response) => {
  try {
    const asset = await Asset.findOne({ where: { uid: req.params.uid } });
    if (asset) {
      res.render('asset/banner', {
        productButtonText: asset.bannerButtonText || 'Visit Website',
        productTitle: asset.productName || asset.name,
        productSubtitle: asset.productSubtitle,
        productPrice: (asset.productSubtitle && asset.productPrice ? ', ' : '') + asset.productPrice || '',
        productUrlDomain: helpers.parseDomain(asset.productUrl || '3xr.com'),
      });
    }
  } catch (err) {
    Errors.resJson(res, err as Error, 'Error getting asset by uid');
  }
});

module.exports = Router;
