// SPDX-License-Identifier: Apache-2.0
import express = require('express');
import { internalOnlyFilter } from '@access/internal_only';
import { FileTypeEnum } from '@enums';
import { Asset } from '@models/asset';
import { AssetFile } from '@models/asset_file';
import { Product } from '@models/product';
import Errors from '@root/errors';

//const Errors = require.main?.require('./errors');
const Router = express.Router();

Router.post('/', internalOnlyFilter, async (req: express.Request, res: express.Response) => {
  try {
    const asset = await Asset.findOne({ where: { uid: req.body.uid } });
    if (!asset) {
      throw new Error(`Cannot verify file uploads. File upload from ${req.body.uid}.`);
    }
    const product = await Product.findOne({ where: { assetId: asset.id } });
    const crateAndBarrelName = product?.partNumber + '_' + product?.name.replace(/[^a-zA-Z0-9 -]+/g, '') + '.zip';
    const approvedFilesToUpload: Array<any> = [];

    const existingFiles = await AssetFile.findAll({
      where: {
        assetId: asset.id,
      },
    });

    const existingFilenames = existingFiles.map(f => f.filename);

    for (let i = 0; i < req.body.files.length; i++) {
      let skip = false;
      let updateRequired = false;
      let typeId = FileTypeEnum.UNKNOWN;
      let existingFile: any = null;
      const file = req.body.files[i];
      const ext = file.name.split('.').pop();

      // TODO: Record resolution to assetFile

      // Confirm this is a file that we want to upload based on extension
      switch (ext) {
        case 'glb':
          typeId = FileTypeEnum.MODEL_GLB;
          break;
        case 'jpg':
          if (req.body.typeId) {
            typeId = req.body.typeId;
          } else if (
            file.name == 'qr-' + asset.name + '.jpg' ||
            file.name == 'qr_' + asset.name + '.jpg'
          ) {
            typeId = FileTypeEnum.QR;
          } else {
            typeId = FileTypeEnum.RENDER_JPG;
            // TODO: mfesta, quick hack JPG not showing in tray
            typeId = FileTypeEnum.RENDER_PNG;
          }
          break;
        case 'png':
          if (
            file.name == 'qr-' + asset.name + '.png' ||
            file.name == 'qr_' + asset.name + '.png'
          ) {
            typeId = FileTypeEnum.QR;
          } else {
            typeId = FileTypeEnum.RENDER_PNG;
            // TODO: Are there any pngs that are not renders?
          }
          break;
        case 'svg':
          typeId = FileTypeEnum.QR;
          // no other svg types at the moment
          break;
        case 'usdz':
          typeId = FileTypeEnum.MODEL_USDZ;
          break;
        case 'zip':
          if (file.name == 'qr-' + asset.name + '.zip') {
            typeId = FileTypeEnum.QR_ZIP;
          } else if (file.name == asset.name + '-orthographic.zip') {
            typeId = FileTypeEnum.RENDER_ORTHOGRAPHIC_ZIP;
          } else if (file.name == crateAndBarrelName) {
            typeId = FileTypeEnum.CRATE_AND_BARREL_ZIP;
          } else {
            // Note that SPIN_360_ZIP is handled elsewhere
            skip = true;
          }
          break;
        default:
          // Skip file extensions that do not match
          skip = true;
          break;
      }

      // Skip if filename, size, and hash are already recorded
      if (existingFilenames.includes(file.name)) {
        updateRequired = true;

        // Check the hash and size
        for (let j = 0; j < existingFiles.length; j++) {
          if (existingFiles[j].filename == file.name) {
            existingFile = existingFiles[j];
            if (existingFiles[j].size == file.size && existingFiles[j].hash == file.hash) {
              skip = true;
            }
          }
        }
      }

      if (skip === false) {
        if (updateRequired) {
          // Update an existing record
          existingFile.size = file.size;
          existingFile.hash = file.hash;
          await existingFile.save();
        } else {
          // Insert a new record
          await AssetFile.create({
            assetId: asset.id,
            filename: file.name,
            hash: file.hash,
            size: file.size,
            typeId: typeId,
          });
        }

        // Send it back so that it can be uploaded by the script
        approvedFilesToUpload.push(file.name);
      }
    }
    res.json(approvedFilesToUpload);
  } catch (err) {
    Errors.resJson(res, err as Error, 'Error getting asset by uid');
  }
});

module.exports = Router;
