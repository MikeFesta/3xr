// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetSubmissionIssueCategoryType } from '@models/asset_submission_issue_category_type';
import Log from '@root/log';
const Router = express.Router();

Router.options('/', studioCors);

Router.get('/', studioCors, (req: express.Request, res: express.Response) => {
  AssetSubmissionIssueCategoryType.scope('categoriesAndIssues')
    .findAll()
    .then(results => {
      res.json(results);
    })
    .catch((err: Error) => {
      Log.error('Unable to load asset submission issues types by category');
      Log.error(err.message);
      res.json([]);
    });
});

module.exports = Router;
