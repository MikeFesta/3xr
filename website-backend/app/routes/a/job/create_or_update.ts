// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Job } from '@models/jobs/job';
import { Project } from '@models/project';
import { Product } from '@models/product';
import Errors from '@root/errors';
import { JobStatusTypeEnum } from '@enums';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const project = await Project.findOne({ where: { uid: req.body.projectUid } });
      if (project) {
        if (req.body.jobUid) {
          try {
            const job = await Job.findOne({ where: { uid: req.body.jobUid } });
            if (job) {
              job.additionalDimensions = req.body.additionalDimensions;
              job.brandId = req.body.brandId;
              job.classId = req.body.classId;
              //job.clientId = req.body.clientId; (not changable)
              job.dateDue = req.body.dateDue;
              job.notes = req.body.notes;
              job.materialInformation = req.body.materialInformation;
              job.modelingInstructions = req.body.modelingInstructions;
              job.price = req.body.price;
              job.priorityId = req.body.priorityId;
              job.qualityId = req.body.qualityId;
              job.statusId =
                job.statusId === JobStatusTypeEnum.PENDING_REVIEW ? JobStatusTypeEnum.UNASSIGNED : job.statusId;
              job.studioId = req.body.studioId;
              job.save();
              const product = await Product.scope('withUnits').findByPk(job.productId);
              if (product) {
                const isDimensionsUpdated =
                  product.depth != req.body.depth ||
                  product.height != req.body.height ||
                  product.width != req.body.width ||
                  (product.units && product.units.id != req.body.units);

                product.asin = req.body.asin;
                product.depth = req.body.depth;
                product.height = req.body.height;
                product.name = req.body.name;
                product.partNumber = req.body.partNumber;
                product.unitTypeId = req.body.unitTypeId;
                product.url = req.body.url;
                product.width = req.body.width;
                product.save();

                // Re-Init if any dimensions change, but only after saving
                if (isDimensionsUpdated) {
                  await product.initAndZip();
                }
                const jobDetails = await Job.scope('details').findOne({ where: { uid: job.uid } });
                res.json(jobDetails);
              }
            } else {
              Errors.resJson(res, new Error('Job not found'), `Error finding job uid ${req.body.jobUid}`);
            }
          } catch (err) {
            Errors.resJson(res, err as Error, `Error creating new product and job for project ${req.body.projectUid}`);
          }
        } else {
          try {
            const productId = await Product.createForProject(
              req.body.depth,
              req.body.height,
              req.body.name,
              req.body.partNumber,
              req.body.units,
              req.body.url,
              req.body.width,
            );
            const jobUid = await Job.createForProject(
              req.body.additionalDimensions,
              req.body.brandId,
              req.body.classId,
              req.body.clientId,
              req.body.dateDue,
              req.body.materialInformation,
              req.body.modelingInstructions,
              req.body.notes,
              req.body.priorityId,
              productId,
              project.id,
              req.body.qualityId,
              req.body.price,
              req.body.studioId,
            );
            const jobDetails = await Job.scope('details').findOne({ where: { uid: jobUid } });
            res.json(jobDetails);
          } catch (err) {
            Errors.resJson(res, err as Error, `Error creating new product and job for project ${req.body.projectUid}`);
          }
        }
      } else {
        Errors.resJson(res, new Error('Project not found'), `Error finding project uid ${req.body.projectUid}`);
      }
    } catch (err) {
      Errors.resJson(res, err as Error, `Error creating or updating job for ${req.body.projectUid}`);
    }
  },
);

module.exports = Router;
