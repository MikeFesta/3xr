// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
const Router = express.Router();

Router.get(
  '/',
  studioCors,
  (req: express.Request, res: express.Response) => {
    res.sendStatus(200);
  },
);

module.exports = Router;
