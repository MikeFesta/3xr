// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmission } from '@models/asset_submission';
import Asset from '@root/models/asset';
import Product from '@root/models/product';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (req.user?.admin) {
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
          res.json(submission);
        })
        .catch((err: Error) => {
          res.json(err);
        });
    } else {
      res.status(403).send('Unauthorized');
    }
  },
);

module.exports = Router;
