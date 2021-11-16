#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let init_material = new ConsumeQueue(
  'init_material',
  '/3xr/code/bash/studio/init/material.sh',
  (obj) => {
    return [
      "-u", obj.data.uid,
      "-n", obj.data.blendName,
      "-d", obj.data.diffuse,
      "-m", obj.data.metallic,
      "-r", obj.data.roughness,
    ];
  }
);

init_material.run();
