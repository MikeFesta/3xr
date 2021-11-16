#!/usr/bin/env node
// SPDX-License-Identifier: Apache-2.0
const ConsumeQueue = require('../models/consume_queue');

let link_material_to_product = new ConsumeQueue(
  'link_material_to_product',
  '/3xr/code/bash/studio/init/link_material_to_product.sh',
  (obj) => {
    //TODO: Think about how to handle multiple materials
    // Pass an array? or multiple times?
    return [
      "-u", obj.data.assignment_uid,
      "-n", obj.data.assignment_name,
      "-i", obj.data.material_uid,
      "-m", obj.data.material_name,
    ];
  }
);

link_material_to_product.run();
