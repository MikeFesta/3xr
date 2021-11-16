#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let publish_asset = new ConsumeQueue(
  'publish_asset',
  '/3xr/code/bash/studio/publish/asset.sh',
  (obj) => {
    return [
      "-u", obj.data.assetUid,
      "-n", obj.data.name,
    ];
  }
);

publish_asset.run();
