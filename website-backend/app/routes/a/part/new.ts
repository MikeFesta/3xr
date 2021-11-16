// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Part } from '@models/part';
import Errors from '@root/errors';
import helpers from '@root/helpers';
import { RabbitMessage } from '@models/rabbit_message';
import Asset from '@root/models/asset';
import AssetSubmission from '@root/models/asset_submission';
import Product from '@root/models/product';
import ProductPart from '@root/models/product_part';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      const blendName = helpers.convertToAlphaSnakeCase(req.body.name).substring(0, 40); // blender filenames cannot be too long
      const nameInUse = await Part.findAll({ where: { blendName: blendName } });
      if (nameInUse.length > 0) {
        res.json({
          success: false,
          errorMessage: 'A Part already exists with the blender filename ' + blendName,
        });
      } else {
        let uid = req.body.uid.toLowerCase();
        let uidValid = true;
        if (uid) {
          const uidRegex = new RegExp('^[a-z0-9]{12}$');
          if (!uidRegex.test(uid)) {
            uidValid = false;
            res.json({
              success: false,
              errorMessage: 'UID needs to be exactly 12 alphanumeric (a-z0-9) characters or left blank',
            });
          } else {
            const uidInUse = await Part.findAll({ where: { uid: uid } });
            if (uidInUse.length > 0) {
              uidValid = false;
              res.json({
                success: false,
                errorMessage: 'A Part already exists with the uid ' + uid,
              });
            }
          }
        } else {
          uid = await helpers.getNewUidForModel(Part, 12);
        }
        if (uidValid) {
          const part = await Part.create({
            blendName,
            createdFromSubmissionId: req.body.submissionId,
            name: req.body.name,
            uid,
          });
          if (part) {
            // Look up the Asset info based on the Submission ID
            const assetSubmission = await AssetSubmission.findByPk(req.body.submissionId);
            if (!assetSubmission) {
              res.json({
                success: false,
                errorMessage: 'Unable to load submission',
              });
            } else {
              const asset = await Asset.findByPk(assetSubmission.assetId);
              if (!asset) {
                // TODO: Support creating a part without coping it from an existing asset
                res.json({
                  success: false,
                  errorMessage: 'Unable to load asset',
                });
              } else {
                // Link this part to the product
                const product = await Product.findOne({ where: { assetId: asset.id } });
                if (product) {
                  await ProductPart.create({
                    productId: product.id,
                    partId: part.id,
                  });
                }
                // Have Asset + Submission info needed to queue a rabbit message
                const data = {
                  assetUid: asset.uid,
                  assetBlendName: asset.name,
                  partBlendName: blendName,
                  submissionNumber: assetSubmission.submissionNumber,
                  uid,
                };
                // Init via rabbit
                await RabbitMessage.sendNewMessageToQueueWithData('init_part', data, req.user.id);
                res.json({
                  success: true,
                  uid: uid,
                });
              }
            }
          } else {
            res.json({
              success: false,
              errorMessage: 'Unable to create part',
            });
          }
        }
      }
    }
  },
);

module.exports = Router;
