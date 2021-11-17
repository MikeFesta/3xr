// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
const Router = Express.Router();

Router.get('/', (req: Express.Request, res: Express.Response) => {
  return res.render('index', {});
});

module.exports = Router;
