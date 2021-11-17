// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
const Router = Express.Router();

Router.get('/:uid', (req: Express.Request, res: Express.Response) => {
  FS.access(
    '/home/node/3xr/public/x/assignments/' + req.params.uid,
    FS.F_OK,
    err => {
      if (err) {
        return res.json('Assignment not found with id ' + req.params.uid);
      } else {
        FS.readdir(
          '/home/node/3xr/public/x/assignments/' + req.params.uid,
          (err, files) => {
            if (err) {
              return res.json('Error reading files');
            } else {
              return res.json(files);
            }
          },
        );
      }
    },
  );
  files = [];
});

module.exports = Router;
