#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../../models/consume_queue');

let product_part_material = new ConsumeQueue(
  'product_part_material',
  '/3xr/code/bash/studio/generate/product_part_material.sh',
  (obj) => {
    return [
      "-a", obj.data.productUid,
      "-b", obj.data.productName,
      "-c", obj.data.partUid,
      "-d", obj.data.partName,
      "-e", obj.data.materialSlots,
      "-f", obj.data.materialUids,
      "-g", obj.data.materialNames,
      "-h", obj.data.materialBlendModes,
    ];
  }
);

product_part_material.run();
