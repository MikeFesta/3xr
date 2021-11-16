// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import ConnectEnsureLogin from 'connect-ensure-login';
import Errors from '@root/errors';
import Job from '@models/jobs/job';
import * as Joi from 'joi';
import Multer from 'multer';
import Product from '@models/product';
import Project from '@models/project';
import { studioCors } from '@cors/studio';
const fs = require('fs').promises;
const parse = require('csv-parse/lib/sync');
const bulkProductSchema = Joi.object({
  name: Joi.string().required(),
  part_number: Joi.string().allow('').required(),
  asin: Joi.string().allow('').required(),
  price: Joi.string().allow('').required(),
  url: Joi.string().allow('').required(),
  height: Joi.number().required(),
  width: Joi.number().required(),
  depth: Joi.number().required(),
  additional_dimensions: Joi.string().allow('').required(),
  material_information: Joi.string().allow('').required(),
  modeling_instructions: Joi.string().allow('').required(),
  notes: Joi.string().allow('').required(),
});
const storage = Multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/bulk_project_uploads');
  },
  filename: function (req, file, cb) {
    cb(null, req.body.uid + '-' + Date.now() + '.csv');
  }
});
var upload = Multer({ storage: storage });
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  upload.single('file'),
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user?.id) {
      try {
        // Load the project from the uid
        const project = await Project.findOne({ where: { uid: req.body.uid } });
        if (!project) {
          throw new Error(`Invalid Purchase Order UID: ${req.body.uid}`);
        }

        // Check permissions
        if (!req.user.admin) {
          const authorized = await project.isUserAuthorized(req.user?.id);
          if (!authorized) {
            throw new Error('Unauthorized. Your user account is not associated with this purchase order.');
          }
        }

        // Parse the .csv
        const csvContent = await fs.readFile(req.file.path);
        const records = parse(csvContent, { columns: true });

        if (records) {
          // Validation
          let rowNumber = 1;
          records.forEach(record => {
            const validationResult = bulkProductSchema.validate(record);
            if (validationResult.error) {
              throw new Error(`Record number ${rowNumber} - ${validationResult.error}.`);
            }
            rowNumber++;
          });

          // TODO: Check database for duplicates (? optonal, nice to have)

          // Insert into database
          records.forEach(async record => {
            const productId = await Product.createForProject(
              record.depth, //depth,
              record.height, //height,
              record.name, //name,
              record.part_number, //partNumber,
              //@ts-ignore
              project.defaultUnitType, //units,
              record.url, //url,
              record.width, //width,
            );

            const jobUid = await Job.createForProject(
              record.additional_dimensions, //additionalDimensions,
              //@ts-ignore
              project.defaultBrand, //brandId,
              //@ts-ignore
              project.defaultClass, //classId,
              //@ts-ignore
              project.clientId, //clientId,
              //@ts-ignore
              project.dateDue, //dateDue,
              record.material_information, //materialInformation,
              record.modeling_instructions, //modelingInstructions,
              record.notes, //notes,
              //@ts-ignore
              project.defaultPriority, //priorityId,
              productId, //productId,
              //@ts-ignore
              project.id, //project.id,
              //@ts-ignore
              project.defaultQuality,//req.body.qualityId,
              record.price,
              project.studioId,
            );
          });
        }
        res.json(records.length + ' Product' + (records.length > 1 ? 's' : '') + ' Processed');
      } catch (err) {
        Errors.resJson(res, err as Error, (err as Error).message || 'Error processing csv');
      }
    }
  },
);

module.exports = Router;
