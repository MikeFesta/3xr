// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
import Multer from 'multer';
const Router = Express.Router();

var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    var folder =
      'public/x/assets/' +
      req.body.assetUid +
      '/submissions/' +
      req.body.submissionNumber +
      '/qa';
    if (!FS.existsSync(folder)) {
      FS.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

//Multer object creation
var upload = Multer({
  storage: storage,
});

Router.post('/', upload.array('images', 100), (req: Express.Request, res: Express.Response) => {
  Log.debug(
    'Uploading qa image for ' +
    req.body.assetUid +
    ' number: ' +
    req.body.submissionNumber,
  );
  Log.debug('Image Count = ' + req.files.length);
  if (req.files.length == 0) {
    res.json('no images provided');
  } else {
    // Note: they can't be recorded in the database because the issue id does not
    // yet exist
    res.json('success');
  }
});

module.exports = Router;
