// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';

const Router = express.Router();

Router.options('/', studioCors);

Router.get('/', studioCors, (req: express.Request, res: express.Response) => {
  req.logout();
  res.json('success');
});

module.exports = Router;
