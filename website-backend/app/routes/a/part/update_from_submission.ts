// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Part } from '@models/part';
import Errors from '@root/errors';
import { RabbitMessage } from '@models/rabbit_message';
import Asset from '@root/models/asset';
import AssetSubmission from '@root/models/asset_submission';
import Product from '@root/models/product';
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
      // Find the linked part based on the submission id (error if it does not have a part linked)
      const submission = await AssetSubmission.findByPk(req.body.submissionId);
      if (!submission) {
        res.json('Submission Not Found ' + req.body.submissionId);
      } else {
        const asset = await Asset.findByPk(submission.assetId);
        if (!asset) {
          res.json('Asset not found ' + submission.assetId);
        } else {
          const product = await Product.findOne({
            where: {
              assetId: asset.id
            }
          });
          if (!product) {
            res.json('Asset Not Linked to a Product');
          } else {
            const part = await Part.scope({ method: ['forProduct', product.id] }).findOne();
            if (!part) {
              res.json('Product ' + product.id + ' not linked to a Part');
            } else {
              part.createdFromSubmissionId = submission.id;
              await part.save();
              // (re)Init via rabbit
              const data = {
                assetUid: asset.uid,
                assetBlendName: asset.name,
                partBlendName: part.blendName,
                submissionNumber: submission.submissionNumber,
                uid: part.uid,
              };
              await RabbitMessage.sendNewMessageToQueueWithData('init_part', data, req.user.id);
              res.json('success');
            }
          }
        }
      }
    }
  },
);

module.exports = Router;
