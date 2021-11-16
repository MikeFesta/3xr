// SPDX-License-Identifier: Apache-2.0
import express from 'express';
const Router = express.Router();

Router.get('/', (req: express.Request, res: express.Response) => {
  return res.render('index', {});
});

module.exports = Router;
