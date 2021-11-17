// SPDX-License-Identifier: Apache-2.0
import Asset from '@models/asset';
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
const Router = Express.Router();

Router.get(
  '/:uid/:submission/files_available',
  (req: Express.Request, res: Express.Response) => {
    if (req.ip != 'REDACTED') {
      return res.json('Invalid Request');
    } else {
      var files_info = {
        dir_name: '',
        error: '',
        models: {
          glb: false,
          usdz: false,
        },
        thumbnail: false,
        textures: [],
      };
      Asset.findOne({ where: { uid: req.params.uid } })
        .then(asset => {
          files_info.dir_name =
            '/home/node/3xr/public/x/assets/' +
            folder_shortname +
            '/submissions/' +
            req.params.submission;
          Log.debug('Looking up files for ' + files_info.dir_name);
          FS.access(files_info.dir_name, FS.F_OK, err => {
            if (err) {
              files_info.error = 'Asset, submission not found on x.3xr.com';
              Log.error('Asset not found');
              return res.json(files_info);
            } else {
              FS.readdir(files_info.dir_name, (err, files) => {
                if (err) {
                  files_info.error =
                    'Submission directory not found or permissions incorrect';
                  Log.error(
                    'Submission Directory not found or permissions incorrect',
                  );
                  Log.error(err);
                  return res.json(files_info);
                } else {
                  let image_files = [];
                  let value_files = [];
                  for (i = 0; i < files.length; i++) {
                    Log.debug(files[i]);
                    let ext = files[i].split('.').pop();
                    Log.debug(ext);
                    if (ext == 'jpg' || ext == 'png') {
                      image_files.push(files[i]);
                    }
                    if (ext == 'value') {
                      // Metallic or Roughness value - need to read the file
                      // TODO: This is a quick hack - Sync should not be used on a webserver!
                      let value = FS.readFileSync(
                        files_info.dir_name + files[i],
                        'utf8',
                      );
                      value_files.push({ name: files[i], value: value });
                    }
                    if (files[i] == asset.name + '.glb') {
                      files_info.models.glb = true;
                    }
                    if (files[i] == asset.name + '.usdz') {
                      files_info.models.usdz = true;
                    }
                    if (files[i] == asset.name + '-256.jpg') {
                      files_info.thumbnail = true;
                    }
                  }
                  files_info.textures = image_files;
                  files_info.values = value_files;
                }
                return res.json(files_info);
              });
            }
          });
        })
        .catch(err => {
          Log.error(err);
          files_info.error = 'Error loading asset with uid ' + req.params.uid;
          return res.json(files_info);
        });
    }
  },
);

module.exports = Router;
