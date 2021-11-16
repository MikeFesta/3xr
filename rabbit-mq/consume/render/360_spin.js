#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let render_360_spin = new ConsumeQueue(
  'render_360_spin',
  '/3xr/code/bash/studio/render/360_spin.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-n", obj.data.name,
      "-p", obj.data.phi,
      "-r", obj.data.radius,
    ];
  }
);

render_360_spin.run();
