// SPDX-License-Identifier: Apache-2.0
'use strict';

module.exports = class ChildPromise {
  static fromProcess(child) {
    return new Promise((resolve, reject) => {
      child.addListener('error', reject);
      child.addListener('exit', resolve);
    });
  }
}
