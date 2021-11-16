#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let init_part = new ConsumeQueue(
  'init_part',
  '/3xr/code/bash/studio/init/part.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-b", obj.data.assetBlendName,
      "-c", obj.data.submissionNumber,
      "-n", obj.data.partBlendName,
      "-u", obj.data.uid,
    ];
  }
);

init_part.run();
