// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
import Multer from 'multer';
import RequestPromise from 'request-promise';
const Router = Express.Router();

var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    var folder = 'public/x/products/' + req.body.uid + '/reference/other';
    Log.debug('Saving to folder');
    Log.debug(folder);
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

Router.post('/', upload.array('files', 100), (req: Express.Request, res: Express.Response) => {
  Log.debug('Uploading files for ' + req.body.uid);
  Log.debug('Image Count = ' + req.files.length);
  if (req.files.length == 0) {
    res.json('no files provided');
  } else {
    // Files have been uploaded, record them in the database
    fileNames = [];
    for (let i = 0; i < req.files.length; i++) {
      Log.debug('push image');
      Log.debug(req.files[i].originalname);
      fileNames.push(req.files[i].originalname);
    }
    Log.debug(JSON.stringify(fileNames));
    RequestPromise({
      method: 'POST',
      uri:
        'https://' +
        (req.body.dev ? req.body.dev + '.dev' : 'www') +
        '.3xr.com/a/product/file_upload_complete',
      form: {
        uid: req.body.uid,
        files: JSON.stringify(fileNames),
      },
    })
      .then(body => {
        res.json('success');
      })
      .catch(err => {
        return res.json('error: ' + err);
      });
  }
});

module.exports = Router;
