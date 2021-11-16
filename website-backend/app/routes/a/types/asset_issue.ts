// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { AssetIssueType } from '@models/asset_issue_type';
const Router = express.Router();

Router.get('/', (req: express.Request, res: express.Response) => {
  AssetIssueType.findAll({
    attributes: ['id', 'name', 'category_id'],
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
