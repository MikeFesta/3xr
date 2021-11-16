#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let product_submission = new ConsumeQueue(
  'process_product_submission',
  '/3xr/code/bash/studio/process/product_submission.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-c", obj.data.submissionNumber,
      "-f", obj.data.folder,
      "-i", obj.data.asin,
      "-n", obj.data.name,
      "-p", obj.data.productUid,
      "-s", obj.data.submissionId
    ];
  }
);

product_submission.run();
