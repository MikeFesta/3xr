// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { AssetMetric } from '@models/asset_metric';
import Log from '@root/log';
const Cors = require('cors');
const Router = express.Router();

Router.post('/', Cors(), async (req: express.Request, res: express.Response) => {
  try {
    await AssetMetric.create({
      abId: req.body.abId || null,
      assetUid: req.body.assetUid,
      cameraEngagement: req.body.cameraEngagement,
      customerUid: req.body.customerUid,
      deviceTypeId: req.body.deviceTypeId,
      ipAddress: req.ip,
      metricTypeId: req.body.metricTypeId,
      notes: req.body.notes,
      sessionTimeMs: req.body.sessionTime,
      sessionUid: req.body.sessionUid,
      source: req.body.src,
      url: req.body.url,
      userAgent: req.headers['user-agent'],
      viewerSessionUid: req.body.viewerSessionUid,
    });
    res.sendStatus(200);
  } catch {
    Log.error('Error Logging Metrics');
    res.json('ERROR');
  }
});

module.exports = Router;
