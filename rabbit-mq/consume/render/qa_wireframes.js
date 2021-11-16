#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let render_qa_wireframes = new ConsumeQueue(
  'render_qa_wireframes',
  '/3xr/code/bash/studio/render/qa_wireframes.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-c", obj.data.submissionNumber,
      "-n", obj.data.name,
      "-s", obj.data.submissionId,
    ];
  }
);

render_qa_wireframes.run();
