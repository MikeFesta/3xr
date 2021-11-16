// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmission } from '@models/asset_submission';
import Asset from '@root/models/asset';
import Product from '@root/models/product';
import internalOnlyFilter from '@root/access/internal_only';
const Router = express.Router();

Router.get(
  '/',
  studioCors,
  internalOnlyFilter,
  (req: express.Request, res: express.Response) => {
    AssetSubmission.findOne(
      {
        'attributes': ['id', 'createdAt', 'submissionNumber'],
        'include': [{
          attributes: ['uid', 'name'],
          as: 'asset',
          include: [{
            attributes: ['uid'],
            as: 'product',
            model: Product
          }],
          model: Asset,
        }],
        'order': [['updatedAt', 'DESC']]
      },
    )
      .then(submission => {
        if (submission && submission.asset) {
          res.json({
            submissionNumber: submission.submissionNumber,
            asset: {
              name: submission?.asset.name,
              uid: submission?.asset.uid,
            }
          });
        } else {
          throw 'Asset not found';
        }
      })
      .catch((err: Error) => {
        res.json(err);
      });
  },
);

module.exports = Router;
