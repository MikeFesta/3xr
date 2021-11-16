#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let extract_project_resources = new ConsumeQueue(
  'extract_project_resources',
  '/3xr/code/bash/studio/extract/project_resources.sh',
  (obj) => {
    return [
      "-n", obj.data.filename,
      "-u", obj.data.projectUid,
    ];
  }
);

extract_project_resources.run();
