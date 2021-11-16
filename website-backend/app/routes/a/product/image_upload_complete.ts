// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Product } from '@models/product';
import { ProductReferenceImage } from '@models/product_reference_image';
import Errors from '@root/errors';
import Log from '@root/log';
const SQL = require.main?.require('./sql').default;
const Router = express.Router();

Router.post('/', async (req: express.Request, res: express.Response) => {
  if (req.ip != 'REDACTED') {
    res.json('unauthorized');
  } else {
    try {
      const product = await Product.scope('withUnits').findOne({ where: { uid: req.body.uid } });
      if (product) {
        const uploadedImagesNames = JSON.parse(req.body.images);
        if (req.body.referenceImageId) {
          const productReferenceImage = await ProductReferenceImage.findOne({ where: { id: parseInt(req.body.referenceImageId) } });
          if (productReferenceImage) {
            productReferenceImage.filename = uploadedImagesNames[0];
            await productReferenceImage.save();
            Log.info(`Updatted product reference image "filename"  for reference image ${req.body.referenceImageId}.`);
          } else {
            Log.error(`Failed to upload product reference image "filename" for reference image ${req.body.referenceImageId}.`);
          }
        } else {
          const existingImages = await ProductReferenceImage.findAll({ where: { productId: product.id } });
          const newReferenceImages: Array<any> = [];
          for (let i = 0; i < uploadedImagesNames.length; i++) {
            let duplicate = false;
            let maxSortWeight = 0;
            for (let j = 0; j < existingImages.length; j++) {
              if (existingImages[j].filename == uploadedImagesNames[i]) {
                // TODO: Use file hash once it is being stored
                duplicate = true;
              }
              if (existingImages[j].sortWeight > maxSortWeight) {
                maxSortWeight = existingImages[j].sortWeight;
              }
            }
            if (!duplicate) {
              newReferenceImages.push({
                product_id: product.id,
                filename: uploadedImagesNames[i],
                sort_weight: i + maxSortWeight + 1,
                created_at: new Date(),
                updated_at: new Date(),
              });
            }
          }
          await SQL.queryInterface.bulkInsert('product_reference_images', newReferenceImages);
          Log.info(`Bulk inserted ${newReferenceImages.length} reference images`);
        }
        await product.initAndZip();
        Log.info(`Init product & zipped image for product id: ${product.id}.`);
        res.json('success');

      } else {
        throw new Error(`Unable to upload ReferenceImage. Could not find a Product with an id of ${req.params.id}.`)
      }
    } catch {
      Errors.resJson(res, null, 'Error removing reference image from product ' + req.body.uid);
    }
  }
});

module.exports = Router;
