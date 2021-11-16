#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let render_material = new ConsumeQueue(
  'render_material',
  '/3xr/code/bash/studio/render/material.sh',
  (obj) => {
    return [
      "-u", obj.data.uid,
      "-n", obj.data.blendName,
      "-r", obj.data.resolution,
    ];
  }
);

render_material.run();
