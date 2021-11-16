// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Product } from '@models/product';
import { ProductAdditionalFile } from '@models/product_additional_file';
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
        const existingFiles = await ProductAdditionalFile.findAll({ where: { productId: product.id } });
        const newReferenceFiles: Array<any> = [];
        const fileNames = JSON.parse(req.body.files);
        for (let i = 0; i < fileNames.length; i++) {
          let duplicate = false;
          let maxSortWeight = 0;
          for (let j = 0; j < existingFiles.length; j++) {
            if (existingFiles[j].filename == fileNames[i]) {
              // TODO: Use file hash once it is being stored
              duplicate = true;
            }
            if (existingFiles[j].sortWeight > maxSortWeight) {
              maxSortWeight = existingFiles[j].sortWeight;
            }
          }
          if (!duplicate) {
            newReferenceFiles.push({
              product_id: product.id,
              filename: fileNames[i],
              sort_weight: i + maxSortWeight + 1,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        }
        await product.initAndZip();
        await SQL.queryInterface.bulkInsert('product_additional_files', newReferenceFiles);
        res.json('success');
      } else {
        throw new Error();
      }
    } catch {
      Log.error('Error updating files for product with uid ' + req.body.uid);
      res.json('error getting product by uid');
    }
  }
});

module.exports = Router;
