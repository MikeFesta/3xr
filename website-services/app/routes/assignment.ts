// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
const Router = Express.Router();

Router.get('/:uid/download', (req: Express.Request, res: Express.Response) => {
  Log.warn('{uid: ' + req.params.uid + ', ip: ' + req.ip + '}');
  FS.access(
    '/home/node/3xr/public/x/outgoing/' + req.params.uid + '.zip',
    FS.F_OK,
    err => {
      if (err) {
        Log.error(err);
        res.json("{error: 'Unable to locate file.'}");
      } else {
        res.redirect('/x/outgoing/' + req.params.uid + '.zip');
      }
    },
  );
});

module.exports = Router;
