// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Product } from '@models/product';
import { Project } from '@models/project';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);
Router.options('/:assetUid', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    // This is an inactive user account that uses their list of favorties just for this purpose
    const products = await Product.scope({ method: ['favoritesForUser', 77] }).findAll();
    res.json(products);
  },
);

Router.get(
  '/:assetUid',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    // For now, loading all completed assets in the same PO
    const project = await Project.scope({ method: ['forAssetUid', req.params.assetUid] }).findAll();
    const products = await Product.scope({ method: ['completedAssetsOnProject', (project[0]?.id || 0)] }).findAll();
    res.json(products);
  },
);

module.exports = Router;
