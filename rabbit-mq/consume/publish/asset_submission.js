#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let init_product = new ConsumeQueue(
  'publish_asset_submission',
  '/3xr/code/bash/studio/publish/asset_submission.sh',
  (obj) => {
    return [
      "-c", obj.data.submissionNumber,
      "-n", obj.data.name,
      "-u", obj.data.assetUid,
    ];
  }
);

init_product.run();
