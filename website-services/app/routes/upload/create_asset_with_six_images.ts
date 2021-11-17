// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
import Multer from 'multer';
import RequestPromise from 'request-promise';
const Router = Express.Router();

var storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    var folder = 'public/x/incoming/' + req.body.name + '/';
    if (!FS.existsSync(folder)) {
      FS.mkdirSync(folder);
    }
    cb(null, folder);
  },
  filename: function (req, file, cb) {
    console.log(JSON.stringify(file));
    var new_name = file.fieldname + '.' + file.originalname.split('.').pop();
    cb(null, new_name);
  },
});

//Multer object creation
var upload = Multer({
  storage: storage,
});

Router.get('/', (req: Express.Request, res: Express.Response) => {
  res.render('upload/test');
});

Router.post(
  '/',
  upload.fields([
    { name: 'front_image', max_count: 1 },
    { name: 'right_image', max_count: 1 },
    { name: 'left_image', max_count: 1 },
    { name: 'back_image', max_count: 1 },
    { name: 'top_image', max_count: 1 },
    { name: 'bottom_image', max_count: 1 },
  ]),
  (req: Express.Request, res: Express.Response) => {
    // Files have been uploaded, post back to www.3xr.com to create the project
    RequestPromise({
      method: 'POST',
      uri: 'https://www.3xr.com/admin/assignment/create_asset',
      form: {
        name: req.body.name,
        uid: req.body.uid,
      },
    })
      .then(result => {
        // TODO: no guarentee which rabbit message will be processed first, probably want to send this message from the rabbit create_asset process on .100
        RequestPromise({
          method: 'POST',
          uri: 'https://x.3xr.com/messages/move_reference_photos',
          form: {
            name: req.body.name,
            //uid: req.params.uid,
          },
        })
          .then(result => {
            // Done, redirect back to the assignment
            res.redirect('https://www.3xr.com/assignment/view/' + req.body.uid);
          })
          .catch(err => {
            res.json('error: ' + err);
          });
      })
      .catch(err => {
        res.json('error: ' + err);
      });
  },
);

module.exports = Router;
