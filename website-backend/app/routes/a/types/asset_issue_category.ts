// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { AssetIssueCategoryType } from '@models/asset_issue_category_type';
const Router = express.Router();

Router.get('/', (req: express.Request, res: express.Response) => {
  AssetIssueCategoryType.findAll({
    attributes: ['id', 'name'],
    order: ['sort_weight'],
  })
    .then(results => {
      res.json(results);
    })
    .catch((err: Error) => {
      res.json('Loading Error');
    });
});

module.exports = Router;
