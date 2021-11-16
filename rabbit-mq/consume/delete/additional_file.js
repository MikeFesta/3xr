#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let delete_additional_file = new ConsumeQueue(
  'delete_additional_file',
  '/3xr/code/bash/studio/delete/additional_file.sh',
  (obj) => {
    return [
      "-n", obj.data.filename,
      "-i", obj.data.productUid,
    ];
  }
);

delete_additional_file.run();
