#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let render_image_from_angle = new ConsumeQueue(
  'render_image_from_angle',
  '/3xr/code/bash/studio/render/image_from_angle.sh',
  (obj) => {
    return [
      "-a", obj.data.assetUid,
      "-f", obj.data.filename,
      "-n", obj.data.name,
      "-p", obj.data.phi,
      "-r", obj.data.radius,
      "-t", obj.data.theta,
      "-l", obj.data.lineDraw,
    ];
  }
);

render_image_from_angle.run();
