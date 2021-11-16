// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { Op } from 'sequelize';
import { studioCors } from '@cors/studio';
import { NotificationReadStatusTypeEnum } from '@enums';
import { Notification } from '@models/notification';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);
Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const pendingNotifications = await Notification.scope([
        'defaultScope',
        'pending',
        'withClient',
        'withJobComment',
        'withProduct',
        'withProject',
        'withRefUser',
        'withUser',
      ]).findAll({
        where: {
          userId: req.user?.id,
        },
      });

      const doneNotifications =
        pendingNotifications.length < 5
          ? await Notification.scope([
            'defaultScope',
            'done',
            'withClient',
            'withJobComment',
            'withProduct',
            'withProject',
            'withRefUser',
            'withUser',
          ]).findAll({
            where: {
              userId: req.user?.id,
            },
            limit: 5,
          })
          : [];

      const notifications = pendingNotifications.concat(doneNotifications);
      res.json(notifications);
    } catch (err) {
      res.json(err);
    }
  },
);

Router.options('/mark_read/:id', studioCors);
Router.post(
  '/mark_read/:id',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await Notification.update(
        { readStatusId: NotificationReadStatusTypeEnum.DONE },
        {
          where: {
            userId: req.user?.id,
            readStatusId: NotificationReadStatusTypeEnum.PENDING,
            id: req.params.id,
          },
        },
      );
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  },
);

Router.options('/mark_all_read', studioCors);
Router.post(
  '/mark_all_read',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await Notification.update(
        { readStatusId: NotificationReadStatusTypeEnum.DONE },
        {
          where: {
            userId: req.user?.id,
            readStatusId: NotificationReadStatusTypeEnum.PENDING,
          },
        },
      );
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  },
);

Router.options('/clear_all', studioCors);
Router.post(
  '/clear_all',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await Notification.update(
        { readStatusId: NotificationReadStatusTypeEnum.DELETED },
        {
          where: {
            userId: req.user?.id,
            readStatusId: {
              [Op.not]: NotificationReadStatusTypeEnum.DELETED,
            },
          },
        },
      );
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  },
);

Router.options('/delete/:id', studioCors);
Router.post(
  '/delete/:id',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const result = await Notification.update(
        { readStatusId: NotificationReadStatusTypeEnum.DELETED },
        {
          where: {
            userId: req.user?.id,
            id: req.params.id,
          },
        },
      );
      res.json(result);
    } catch (err) {
      res.json(err);
    }
  },
);

module.exports = Router;
