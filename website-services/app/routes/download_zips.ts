// SPDX-License-Identifier: Apache-2.0
import Express from 'express';
import Log from '@root/log';
import Cors from '@cors/x3';
import SQL from '@root/sql';
import { exec } from 'child_process';
import { QueryTypes } from 'sequelize';
const Router = Express.Router();

Router.options('/', Cors);

Router.post('/', async (req: Express.Request, res: Express.Response) => {
  try {
    let fileTypeName = 'unknown'
    switch (req.body.fileType) {
      case 4: // USDZ
        fileTypeName = 'usdz';
        break;
      case 5: // GLB
        fileTypeName = 'glb';
        break;
      case 13: // Crate & Barrel Zip
        fileTypeName = 'zip';
        break;
    }
    Log.debug('Zipping ' + req.body.jobUids.length + ' of filetype ' + fileTypeName);
    Log.debug(req.body.jobUids);
    // Just using a raw sql query so we don't have to worry about syncing the models directory
    // 1. Look up the file locations to be zipped
    const zip_locations = await SQL.query(
      "SELECT CONCAT ('../assets/', assets.uid, '/final/', asset_files.filename) FROM jobs JOIN products ON jobs.product_id = products.id JOIN assets ON products.asset_id = assets.id JOIN asset_files ON asset_files.asset_id = assets.id WHERE jobs.uid IN (:uids) AND asset_files.type_id = :fileTypeId",
      {
        replacements: { uids: req.body.jobUids, fileTypeId: req.body.fileType },
        type: QueryTypes.SELECT,
        raw: true
      }
    );
    // 2. Zip the files to a temporary location (cleaned up by a daily job)
    const now = new Date()
    const zipName = '3xr_' + fileTypeName + '_' +
      now.getFullYear().toString() + '-' +
      (now.getMonth() + 1).toString().padStart(2, '0') + '-' +
      now.getDate().toString().padStart(2, '0') + '_with_' +
      zip_locations.length + '_files_' +
      now.valueOf() + '.zip'
    const filesToZip = zip_locations.map(zip_path => {
      return '"' + zip_path.concat + '"'
    }).join(' ');

    exec('cd public/x/zips && zip -0 -u -j ' + zipName + ' ' + filesToZip, (error, stdout, stderr) => {
      if (error) {
        console.error(error);
        res.json({ error: 'Error zipping files' });
      } else {
        console.log(stdout);
        // 3. Send back the link to the new zip file
        res.json('https://x.3xr.com/x/zips/' + zipName);
      }
    });
  } catch (e) {
    res.json({ error: 'Unable to zip files' });
  }
});

module.exports = Router;
