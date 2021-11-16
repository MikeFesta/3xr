#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let init_product = new ConsumeQueue(
  'init_product',
  '/3xr/code/bash/studio/init/product.sh',
  (obj) => {
    return [
      "-n", obj.data.name,
      "-i", obj.data.product_uid,
      "-u", obj.data.unit_type,
      "-h", obj.data.height,
      "-w", obj.data.width,
      "-d", obj.data.depth
    ];
  }
);

init_product.run();
