#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let init_base_material = new ConsumeQueue(
  'init_base_material',
  '/3xr/code/bash/studio/init/base_material.sh',
  (obj) => {
    return [
      "-u", obj.data.uid,
      "-n", obj.data.blendName,
      "-d", obj.data.diffuse,
      "-m", obj.data.metallic,
      "-r", obj.data.roughness,
      "-s", obj.data.normalStrength,
      "-v", obj.data.mappingScale,
    ];
  }
);

init_base_material.run();
