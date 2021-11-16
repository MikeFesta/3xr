// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { Project } from '@models/project';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const project = await Project.findOne({
        where: { uid: req.body.uid },
      });

      if (!project) {
        throw new Error('could not find project');
      }

      project.clientId = req.body.clientId;
      project.dateDue = req.body.dateDue;
      project.defaultArtistId = req.body.artistId;
      project.defaultBrand = req.body.brandId;
      project.defaultClass = req.body.classId;
      project.defaultPrice = req.body.defaultPrice;
      project.studioId = req.body.studioId;
      project.defaultUnitType = req.body.unitTypeId;
      project.name = req.body.name;

      const savedProject = await project.save();
      const projectWithDetails = await Project.scope('details').findByPk(savedProject.id);
      res.json(projectWithDetails);
    } catch (err) {
      Errors.resJson(res, err as Error, 'error updating project');
    }
  },
);

module.exports = Router;
