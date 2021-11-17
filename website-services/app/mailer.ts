// SPDX-License-Identifier: Apache-2.0
import Log from '@root/log';

module.exports = {
  sendMessage: (to: string, subject: string, text: string, html?: string) => {
    return new Promise((resolve, reject) => {
      Log.error('Mail Not Enabled on x.3xr.com');
      reject();
    });
  },
};
