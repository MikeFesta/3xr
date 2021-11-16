// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { ProjectStatusTypesEnum, NotificationTypeEnum } from '@enums';
import { Project } from '@models/project';
import { sendNotificationsToAdmins } from '@services/Notifications';
import Helpers from '../../../helpers';
import Log from '@root/log';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      if (req.user) {
        const authorUserId = req.user.id;
        const newUUId: string = await Helpers.getNewUidForModel(Project, 12);
        const data = {
          clientId: req.body.clientId,
          dateDue: req.body.dateDue,
          defaultArtistId: req.body.artistId,
          defaultBrand: req.body.brandId,
          defaultClass: req.body.classId,
          defaultPrice: req.body.defaultPrice,
          defaultPriority: req.body.priorityId,
          defaultQuality: req.body.qualityId,
          defaultUnitType: req.body.unitTypeId,
          name: req.body.name,
          statusId: ProjectStatusTypesEnum.UNSUBMITTED,
          studioId: req.body.studioId,
          uid: newUUId,
        };
        const project = await Project.create(data);
        const notification = {
          notificationTypeId: NotificationTypeEnum.PROJECT_CREATED,
          refUserId: authorUserId,
          projectId: project.id,
        };
        await sendNotificationsToAdmins(notification);
        res.json(project.uid);
      } else {
        res.status(403).send('unauthorized');
      }
    } catch (err) {
      Log.error(err);
      res.json('error creating project');
    }
  },
);

module.exports = Router;
