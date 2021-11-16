// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Asset } from '@models/asset';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionStatusTypeEnum } from '@enums';
import { AssetSubmissionTexture } from '@models/asset_submission_texture';
import { Product } from '@models/product';
import { User } from '@models/user';
import Errors from '@root/errors';
const Router = express.Router();

Router.post('/', (req: express.Request, res: express.Response) => {
  if (req.ip != 'REDACTED') {
    res.json('unauthorized');
  } else {
    let asset: any;
    let product: any;
    let submission: any;
    let userId: number;
    // Step 1: Confirm User Token
    User.findOne({ where: { apiToken: req.body.apiToken } })
      .then((user: any) => {
        userId = user.id;
        // Step 2: Load the product and confirm the user is the artist
        return Product.findOne({ where: { artistUserId: userId, uid: req.body.uid } });
      })
      .then((productResult: any) => {
        if (!productResult) {
          throw new Error('No product found for ' + req.body.uid);
        }
        product = productResult;
        if (product.assetId) {
          // Step 3a: Load the asset if it exists
          return Asset.findByPk(product.assetId);
        } else {
          // Step 3b: Create an asset if it does not exist
          return new Promise((resolve: Function, reject: Function) => {
            Asset.createForProduct(product.id)
              .then((assetResult: any) => {
                asset = assetResult;
                product.assetId = asset.id;
                return product.save();
              })
              .then((productSaved: any) => {
                resolve();
              })
              .catch((err: Error) => {
                reject();
              });
          });
        }
      })
      .then((assetResult: any) => {
        if (assetResult != null) {
          asset = assetResult;
        }
        // Step 4: Load the latest submission (if any)
        return AssetSubmission.scope({ method: ['latestForAsset', asset.id] }).findOne();
      })
      .then((latestSubmission: any) => {
        if (latestSubmission) {
          if (
            [
              AssetSubmissionStatusTypeEnum.SUBMISSION_CANCELED,
              AssetSubmissionStatusTypeEnum.QA_COMPLETE_FAILED,
            ].includes(latestSubmission.statusId)
          ) {
            // Step 5: Create a new round because the last submission is complete
            return true;
          } else {
            // Step 5: Use the current submission (overwrite)
            submission = latestSubmission;
            // TODO: submission.folder could be updated, but I don't think it is actually used anywhere, so maybe it should be deleted
            return false;
          }
        } else {
          // Step 5: No submissions yet, create a new one
          return true;
        }
      })
      .then((createNewRound: boolean) => {
        if (createNewRound) {
          return AssetSubmission.record(asset.id, req.body.folder, userId);
        } else {
          return submission;
        }
      })
      .then((submissionResult: any) => {
        submission = submissionResult;
        // Step 6: Record textures
        return AssetSubmissionTexture.recordArray(submissionResult.id, JSON.parse(req.body.textures));
      })
      .then((textures: any) => {
        // Step 7: Return data
        res.json({
          asin: product.asin,
          assetUid: asset.uid,
          folder: req.body.folder,
          name: asset.name,
          productUid: product.uid,
          submissionId: submission.id,
          submissionNumber: submission.submissionNumber,
          userId: userId,
        });
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Error recording submission for product ' + req.body.uid);
      });
  }
});

module.exports = Router;
