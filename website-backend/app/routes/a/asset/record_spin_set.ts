// SPDX-License-Identifier: Apache-2.0
import express = require("express");
import { internalOnlyFilter } from '@access/internal_only';
import { Asset } from '@models/asset';
import { AssetSpinSet } from '@models/asset_spin_set';
const Errors = require.main?.require("./errors");
const Router = express.Router();

Router.post(
  "/",
  internalOnlyFilter,
  async (req: express.Request, res: express.Response) => {
    try {
      const asset = await Asset.findOne({ where: { uid: req.body.uid } });
      if (asset) {
        await AssetSpinSet.create({
          angle: req.body.angle,
          assetId: asset.id,
          imageCount: req.body.imageCount,
          resolution: req.body.resolution,
        });
        res.json('success');
      }
      res.json('error');
    } catch (err) {
      Errors.resJson(res, err, "Error getting asset by uid");
    }
  }
);

module.exports = Router;
