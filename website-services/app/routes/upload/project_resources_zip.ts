// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
import Multer from 'multer';
import RequestPromise from 'request-promise';
const Router = Express.Router();

var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    var folder = 'public/x/projects/' + req.body.uid + '/uploads';
    Log.debug('Saving to folder');
    Log.debug(folder);
    if (!FS.existsSync(folder)) {
      FS.mkdirSync(folder, { recursive: true });
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    const date = new Date();
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    const newFilename = year + '_' + month + '_' + day + '-' + date.getTime() + '.zip';
    Log.debug(newFilename);
    cb(null, newFilename);
  },
});

//Multer object creation
var upload = Multer({
  storage: storage,
});

Router.post('/', upload.single('file'), (req: Express.Request, res: Express.Response) => {
  Log.debug('Uploading resources for project ' + req.body.uid);
  if (!req.file) {
    res.json('no file provided');
  } else {
    // Zip has been uploaded, record it in the database and process via rabbit
    Log.debug(req.file.filename);
    RequestPromise({
      method: 'POST',
      uri:
        'https://' +
        (req.body.dev ? 'dev' : 'www') +
        '.3xr.com/a/project/resources_upload_complete',
      form: {
        uid: req.body.uid,
        filename: req.file.filename,
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
