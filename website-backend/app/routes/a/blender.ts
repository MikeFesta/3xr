// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { BlenderAddon } from '@models/blender_addon';
const Router = express.Router();

Router.get('/add-on-version', studioCors, (req: express.Request, res: express.Response) => {
  BlenderAddon.findLatestVersion()
    .then(latest => {
      res.json(latest);
    })
    .catch((err: Error) => {
      res.json('');
    });
});

module.exports = Router;
