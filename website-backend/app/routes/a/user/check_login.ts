// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
const Router = express.Router();

Router.options('/', studioCors);

Router.get('/', studioCors, (req: express.Request, res: express.Response) => {
  if (!req.user) {
    res.json(false);
  } else {
    res.json(true);
  }
});

module.exports = Router;
