// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import Log from '@root/log';

class Errors {
  public reject(reject: Function, err: Error | null, message: string) {
    Log.error(message);
    Log.error(err);
    reject();
  }
  public resJson(res: express.Response, err: Error | null, message: string) {
    this.resJsonWithCode(res, err, message, 500);
  }
  public resJsonWithCode(res: express.Response, err: Error | null, message: string, errorCode: number) {
    Log.error(message);
    Log.error(err?.message);
    res.status(errorCode).send(message);
  }
  public resAdminOnly(res: express.Response) {
    res.status(403).send('Admin Only');
  }
}

export default new Errors();
