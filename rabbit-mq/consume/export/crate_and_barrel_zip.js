#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let export_cb_zip = new ConsumeQueue(
  'export_cb_zip',
  '/3xr/code/bash/studio/export/zip_for_crate_and_barrel.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-b", obj.data.blendName,
      "-c", obj.data.submissionNumber,
      "-n", obj.data.name,
      "-s", obj.data.sku
    ];
  }
);

export_cb_zip.run();
