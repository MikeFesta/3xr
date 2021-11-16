#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let export_submission_models = new ConsumeQueue(
  'export_submission_models',
  '/3xr/code/bash/studio/export/submission_models.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-c", obj.data.submissionNumber,
      "-i", obj.data.asin,
      "-n", obj.data.name,
      "-s", obj.data.submissionId
    ];
  }
);

export_submission_models.run();
