// SPDX-License-Identifier: Apache-2.0
import Log from '@root/log';

class Errors {
  public resJson(res, err, message) {
    Log.error(message);
    Log.error(err);
    res.status(500).send(message);
  }
  public resAdminOnly(res) {
    res.status(403).send('Admin Only');
  }
}

module.exports = new Errors();
