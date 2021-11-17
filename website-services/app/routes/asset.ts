// SPDX-License-Identifier: Apache-2.0
import Asset from '@models/asset';
import Express from 'express';
import FS from 'fs';
import Log from '@root/log';
const Router = Express.Router();

Router.get('/:uid/files_available', (req: Express.Request, res: Express.Response) => {
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
        const folder_shortname = asset.id + '_' + asset.name.substring(0, 8);
        files_info.dir_name = folder_shortname;
        Log.debug('Looking up files for ' + folder_shortname);
        FS.access(
          '/home/node/3xr/public/x/projects/' + folder_shortname,
          FS.F_OK,
          err => {
            if (err) {
              files_info.error = 'Asset not found on x.3xr.com';
              Log.error('Asset not found');
              return res.json(files_info);
            } else {
              FS.readdir(
                '/home/node/3xr/public/x/projects/' +
                folder_shortname +
                '/textures/',
                (err, files) => {
                  if (err) {
                    files_info.error =
                      'Textures directory not found or permissions incorrect';
                    Log.error(
                      'Textures Directory not found or permissions incorrect',
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
                          '/home/node/3xr/public/x/projects/' +
                          folder_shortname +
                          '/textures/' +
                          files[i],
                          'utf8',
                        );
                        value_files.push({ name: files[i], value: value });
                      }
                    }
                    files_info.textures = image_files;
                    files_info.values = value_files;
                  }
                  FS.readdir(
                    '/home/node/3xr/public/x/projects/' +
                    folder_shortname +
                    '/final/',
                    (err, files) => {
                      if (err) {
                        Log.error(
                          'Final Directory not found or permissions incorrect - Has the project been processed yet?',
                        );
                        files_info.error =
                          'Final directory not found or permissions incorrect - Has the project been processed yet?';
                        return res.json(files_info);
                      } else {
                        for (i = 0; i < files.length; i++) {
                          if (files[i] == asset.name + '.glb') {
                            files_info.models.glb = true;
                          }
                          if (files[i] == asset.name + '.usdz') {
                            files_info.models.usdz = true;
                          }
                          if (files[i] == asset.name + '-300.jpg') {
                            files_info.thumbnail = true;
                          }
                        }
                        return res.json(files_info);
                      }
                    },
                  );
                },
              );
            }
          },
        );
      })
      .catch(err => {
        Log.error(err);
        files_info.error = 'Error loading asset with uid ' + req.params.uid;
        return res.json(files_info);
      });
  }
});

module.exports = Router;
