// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
import Moment from 'moment';
import Multer from 'multer';
import Product from '@models/product';
import RequestPromise from 'request-promise';
const Router = Express.Router();

//Multer object creation
var upload = Multer({
  storage: Multer.diskStorage({
    destination: function (req, file, cb) {
      // Validation needs to happen here because req.body is undefined before and files should not be saved if authentication fails
      Product.validateArtistByApiToken(req.body.uid, req.body.api_token)
        .then(result => {
          if (result) {
            var product_folder =
              'public/x/incoming/product_submissions/' + req.body.uid;
            if (!FS.existsSync(product_folder)) {
              FS.mkdirSync(product_folder);
            }
            if (!req.timestampedFolder) {
              req.timestampedFolder = Moment().format('YYYYMMDD_HHmmss');
            }
            var folder =
              'public/x/incoming/product_submissions/' +
              req.body.uid +
              '/' +
              req.timestampedFolder;
            if (!FS.existsSync(folder)) {
              FS.mkdirSync(folder);
            }
            cb(null, folder);
          } else {
            cb('Validation Error', null);
          }
        })
        .catch(err => {
          console.log('error during validation');
          console.log(err);
          cb('Validation Error', null);
        });
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

Router.post('/', upload.any(), (req: Express.Request, res: Express.Response) => {
  if (!req.files) {
    return res.json('error: file missing');
  } else {
    console.log('files uploaded');
    // files uploaded, create an entry into the submission log
    let textures = [];
    for (let i = 0; i < req.files.length; i++) {
      const name = req.files[i].originalname;
      if (name.substring(name.lastIndexOf('.')) != '.blend') {
        textures.push(name);
      }
    }
    console.log(textures);
    RequestPromise({
      method: 'POST',
      uri: 'https://www.3xr.com/a/product/submit',
      form: {
        uid: req.body.uid,
        apiToken: req.body.api_token,
        folder: req.timestampedFolder,
        textures: JSON.stringify(textures),
      },
    })
      .then(body => {
        Log.debug(body);
        var submissionResult = JSON.parse(body);
        Log.debug(submissionResult.submissionId);
        // TODO: ensure a submission id is returned
        //res.json(submissionResult);
        return RequestPromise({
          method: 'POST',
          uri: 'https://x.3xr.com/messages/queue',
          form: {
            data: JSON.stringify({
              asin: submissionResult.asin,
              assetUid: submissionResult.assetUid,
              folder: req.timestampedFolder,
              name: submissionResult.name,
              productUid: submissionResult.productUid,
              submissionId: submissionResult.submissionId,
              submissionNumber: submissionResult.submissionNumber,
            }),
            queue: 'process_product_submission',
            userId: submissionResult.userId,
          },
        })
          .then(result => {
            res.json('success');
          })
          .catch(err => {
            Log.error('Unable to queue message for process_product_submission');
            Log.error(err);
            res.json('error: ' + err);
          });
      })
      .catch(err => {
        return res.json('error: ' + err);
      });
  }
});

module.exports = Router;
