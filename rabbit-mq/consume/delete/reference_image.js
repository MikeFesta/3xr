#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let delete_reference_image = new ConsumeQueue(
  'delete_reference_image',
  '/3xr/code/bash/studio/delete/reference_image.sh',
  (obj) => {
    return [
      "-n", obj.data.filename,
      "-i", obj.data.productUid,
    ];
  }
);

delete_reference_image.run();
