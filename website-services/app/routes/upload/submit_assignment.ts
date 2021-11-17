// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
import Moment from 'moment';
import Multer from 'multer';
import RequestPromise from 'request-promise';
const Router = Express.Router();

var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    var folder = 'public/x/incoming/zips/';
    if (!FS.existsSync(folder)) {
      FS.mkdirSync(folder);
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    console.log(JSON.stringify(file));
    var timestamp = Moment().format('YYYYMMDD_HHmmss');
    var new_name =
      req.body.name +
      '_' +
      timestamp +
      '.' +
      file.originalname.split('.').pop();
    console.log(new_name);
    cb(null, new_name);
  },
});

//Multer object creation
var upload = Multer({
  storage: storage,
});

Router.post('/', upload.single('assignment'), (req: Express.Request, res: Express.Response) => {
  if (!req.file) {
    res.redirect(
      'https://www.3xr.com/assignment/view/' +
      req.body.uid +
      '?submit_assignment_file_missing=1',
    );
  } else {
    // Files have been uploaded, create an entry into the upload log
    RequestPromise({
      method: 'POST',
      uri: 'https://www.3xr.com/assignment/submit',
      form: {
        name: req.body.name,
        modeling_hours: req.body.modeling_hours,
        texturing_hours: req.body.texturing_hours,
        uid: req.body.uid,
      },
    })
      .then(body => {
        var submit_assignment_result = JSON.parse(body);
        return RequestPromise({
          method: 'POST',
          uri: 'https://x.3xr.com/messages/unzip_project',
          form: {
            name: req.body.name,
            asset_id: submit_assignment_result.asset_id,
            filename: req.file.filename,
          },
        })
          .then(result => {
            // Done, redirect back to the assignment
            return res.redirect(
              'https://www.3xr.com/assignment/view/' +
              req.body.uid +
              '?submitted=1',
            );
          })
          .catch(err => {
            Log.error(err);
            return res.json('error: ' + err);
          });
      })
      .catch(err => {
        return res.json('error: ' + err);
      });
  }
});

module.exports = Router;
