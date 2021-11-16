#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let render_master_images = new ConsumeQueue(
  'render_master_images',
  '/3xr/code/bash/studio/render/master_images.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-c", obj.data.submissionNumber,
      "-n", obj.data.name,
      "-s", obj.data.submissionId,
    ];
  }
);

render_master_images.run();
