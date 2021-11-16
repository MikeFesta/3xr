// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import ConnectEnsureLogin from 'connect-ensure-login';
import Errors from '@root/errors';
import { studioCors } from '@cors/studio';
import Archiver from 'archiver';
import Project from '@models/project';
import Product from '@models/product';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/:projectUid',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      // Load the project from the uid
      const project = await Project.findOne({ where: { uid: req.params.projectUid } });
      if (!project) {
        throw new Error(`Unable to find project with UID ${req.params.projectUid}`);
      }

      // Check permissions
      if (!req.user?.admin) {
        const authorized = await project.isUserAuthorized(req.user?.id || 0);
        if (!authorized) {
          throw new Error('Unauthorized. Your user account is not associated this purchase order.');
        }
      }

      // Create the zip
      const filename = project.name + ' ' + project.uid + '.zip';
      res.attachment(filename);
      const zip = Archiver('zip');
      zip.on('finish', function (error) {
        // NOTE: no need to call res.end(), that breaks large requests
        //return res.end();
      });
      zip.on('warning', function (err) {
        if (err.code === 'ENOENT') {
          // log warning
          console.log('Warning while creating the zip');
        } else {
          // throw error
          throw err;
        }
      });
      zip.on('error', function (err) {
        throw err;
      });

      zip.pipe(res);

      // Add the folders
      const products = await Product.scope({ method: ['forProject', project.id] }).findAll();
      if (!products) {
        throw new Error('This purchase order has no products. Please add products first.');
      }

      products.forEach(product => {

        const dirName = `${product.blendName}_${product.uid}`;
        zip.append(null, { name: `${dirName}/images/` });

        zip.append(`[InternetShortcut]\nURL=${product.url}`, { name: `${dirName}/website.url` });
        zip.append(null, { name: `${dirName}/other/` });

        //zip.append(product.job.modelingInstructions, { name: `${dirName}/zip.txt`});
      });

      // Send the zip
      zip.finalize();
    } catch (err) {
      Errors.resJson(res, err as Error, (err as Error).message || 'Error creating template');
    }
  },
);

module.exports = Router;
