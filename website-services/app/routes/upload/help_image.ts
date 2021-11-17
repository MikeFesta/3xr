// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import StudioCors from '@cors/studio';
import FS from 'fs';
import Log from '@root/log';
import Multer from 'multer';
import Path from 'path';
const Router = Express.Router();

var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    var folder = 'public/x/help/images/';
    if (!FS.existsSync(folder)) {
      FS.mkdirSync(folder);
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    // Need unique filenames
    cb(null, Date.now() + Path.extname(file.originalname));
  },
});

//Multer object creation
var upload = Multer({
  storage: storage,
});

Router.options('/', StudioCors);

Router.post(
  '/',
  StudioCors,
  upload.single('image'),
  (req: Express.Request, res: Express.Response) => {
    Log.debug('posting image for .studio help');
    if (!req.file) {
      res.json('file missing');
    } else {
      res.json({
        src: 'https://x.3xr.com/x/help/images/' + req.file.filename,
      });
    }
  },
);

module.exports = Router;
