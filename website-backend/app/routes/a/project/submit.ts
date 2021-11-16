// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Op } from 'sequelize';
import ConnectEnsureLogin from 'connect-ensure-login';
import { NotificationEvent } from '@types';
import { NotificationStatus, NotificationTypeEnum, ProjectStatusTypesEnum } from '@enums';
import { studioCors } from '@cors/studio';
import { Client } from '@models/client';
import { Product } from '@models/product';
import { Project } from '@models/project';
import { UserClient } from '@models/user_client';
import { User } from '@models/user';
import { RabbitMessage } from '@models/rabbit_message';
import { sendJobProgressNotification } from '@services/Notifications';
import Errors from '@root/errors';
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
        throw new Error(`Project with uid: ${req.body.uid} not found.`);
      }

      project.statusId = ProjectStatusTypesEnum.PENDING;
      // Call init on each product in the PO (rabbit message to x.3xr.com)
      const products = await Product.scope({ method: ['forProject', project.id] }).findAll();

      if (!products) {
        throw new Error(`No products found`);
      }

      for (let i = 0; i < products.length; i++) {
        const product = products[i];
        const data = {
          depth: product.depth,
          height: product.height,
          name: product.blendName,
          product_uid: product.uid,
          unit_type: product.units?.name, // needs to be in the scope forProject
          width: product.width,
        };
        if (req.user?.id) {
          await RabbitMessage.sendNewMessageToQueueWithData('init_product', data, req.user.id);
        }
      }

      const savedProject = await project.save();

      const client = await Client.findOne({
        where: {
          id: project.clientId,
        },
      });

      if (!client) {
        throw new Error(`Client not found with id: ${project.clientId}`);
      }

      const admins = await User.findAll({
        where: {
          admin: true,
        },
      });
      const userClients = await UserClient.findAll({
        where: {
          clientId: client.id,
          userId: {
            [Op.not]: req.user?.id,
          },
        },
      });

      const notification: NotificationEvent = {
        status: NotificationStatus.PENDING,
        type: NotificationTypeEnum.PROJECT_CREATED,
        clientId: client.id,
        projectId: project.id,
        contents: [
          ...userClients.map(({ userId }) => ({
            id: userId,
            content: `${project.name} has been submitted for review, 3XR will reach out regarding next steps.`,
          })),
          ...admins.map(({ id }) => ({
            id,
            content: `${client.name} has submitted ${project.name}, please review order.`,
          })),
        ],
      };

      if (!savedProject.notificationStatusId) {
        await sendJobProgressNotification(notification);
        project.notificationStatusId = notification.status;
        await project.save();
      }

      const result = await Project.scope('details').findByPk(savedProject.id);
      res.json(result);
    } catch (err) {
      Errors.resJson(res, err as Error, 'error updating project');
    }
  },
);

module.exports = Router;
