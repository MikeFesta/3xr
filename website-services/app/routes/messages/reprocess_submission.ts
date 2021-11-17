// SPDX-License-Identifier: Apache-2.0
import Asset from '@models/asset';
import AssetSubmission from '@models/asset_submission';
import Express from 'express';
import Log from '@root/log';
import Product from '@models/product';
import RequestPromise from 'request-promise';
import StudioCors from '@cors/studio';
import User from '@models/user';
const Router = Express.Router();

Router.options('/', StudioCors);

Router.post('/', StudioCors, (req: Express.Request, res: Express.Response) => {
  // Authenticate user based on their apiToken
  if (!req.body.apiToken) {
    res.json('Unauthorized');
  } else {
    User.findOne({
      where: { api_token: req.body.apiToken },
    })
      .then((user) => {
        if (user.admin) {
          // Re-process Product Submission based on submission id
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
            .then(submission => {
              Log.debug('Reprocess Submission');
              const data = {
                assetUid: submission.asset.uid,
                folder: submission.folder,
                name: submission.asset.name,
                productUid: submission.asset.product.uid,
                submissionId: submission.id,
                submissionNumber: submission.submissionNumber,
              };
              Log.debug(JSON.stringify(data));
              return RequestPromise({
                method: 'POST',
                uri: 'https://x.3xr.com/messages/queue',
                form: {
                  data: JSON.stringify(data),
                  queue: 'process_product_submission',
                  userId: user.id,
                },
              })
                .then(result => {
                  res.json(result);
                })
                .catch(err => {
                  Log.error(
                    'Unable to queue message for process_product_submission',
                  );
                  Log.error(err);
                  res.json('error: ' + err);
                });
            })
            .catch(err => {
              Log.error(
                'Unable to queue message for process_product_submission',
              );
              Log.error(err);
              res.json('error: ' + err);
            });
        }
      })
      .catch(err => {
        Log.error('Unable to find user by api_token');
        Log.error(err);
        res.json('error: ' + err);
      });
  }
});

module.exports = Router;
