// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Asset } from '@models/asset';
import { AssetSubmission } from '@models/asset_submission';
import { Product } from '@models/product';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const RequestPromise = require('request-promise');
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      AssetSubmission.findOne({
        include: [
          {
            as: 'asset',
            model: Asset,
            include: [
              {
                as: 'product',
                model: Product,
              },
            ],
          },
        ],
        where: { id: req.body.id },
      })
        .then((submission) => {
          if (submission && submission.asset && submission.asset.product) {
            const data = {
              asin: submission.asset.product.asin,
              assetUid: submission.asset.uid,
              folder: submission.folder,
              name: submission.asset.name,
              productUid: submission.asset.product.uid,
              submissionId: submission.id,
              submissionNumber: submission.submissionNumber,
            };
            return RequestPromise({
              method: 'POST',
              uri: 'https://x.3xr.com/messages/queue',
              form: {
                data: JSON.stringify(data),
                queue: 'process_product_submission',
                userId: req.user?.id,
              },
            })
              .then(result => {
                res.json(result);
              })
              .catch((err: Error) => Errors.resJson(res, err, 'Unable to queue reprocess message'));
          } else {
            throw new Error(`Unable to upload ReferenceImage. Cannot find a Submission with an id of ${req.body.id}.`);
          }
        })
        .catch((err: Error) => Errors.resJson(res, err, 'Unable to load submission'));
    }
  },
);

module.exports = Router;
