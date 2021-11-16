// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { BlenderAddon } from '@models/blender_addon';
import { internalOnlyFilter } from '@access/internal_only';
import Log from '@root/log';
const Router = express.Router();

Router.post('/', internalOnlyFilter, (req: express.Request, res: express.Response) => {
  Log.debug('Insert Addon Version: ' + req.body.addonVersion);
  Log.debug('Blender Version: ' + req.body.blenderVersion);
  BlenderAddon.create({
    version: req.body.addonVersion,
    blenderVersion: req.body.blenderVersion,
  })
    .then(result => {
      res.json('done');
    })
    .catch((err: Error) => {
      Log.error('Unable to insert blender addon version');
      res.status(500).send();
    });
});

module.exports = Router;
