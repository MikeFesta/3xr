// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import ConnectEnsureLogin from 'connect-ensure-login';
import {
  sendNotificationsToJobArtistsAndAdmins,
  sendNotificationsToJobClientsAndAdmins,
} from '@services/Notifications';
import Errors from '@root/errors';
import Helpers from '@root/helpers';
import { INotificationWithoutRecipient, TemplateRequest } from '@types';
import { EmailType, JobCommentTypeEnum, NotificationTypeEnum } from '@enums';
import { Job } from '@models/jobs/job';
import { JobComment } from '@models/job_comment';
import { User } from '@models/user';
import { UserClient } from '@models/user_client';
import { Product } from '@models/product';
import { studioCors } from '@cors/studio';
import Email from '@root/email/email';
import helpers from '@root/helpers';
const Router = express.Router({ mergeParams: true });

Router.options('/artist', studioCors);
Router.get(
  '/artist',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      const jobUid = req.params.jobUid;
      const userId = req.user.id;
      try {
        const jobDetailsForComments = await Job.scope({ method: ['forComments', jobUid] }).findOne();
        if (!jobDetailsForComments) {
          throw new Error('cannot find job details for comments');
        }

        // Product relationship
        const productArtistUserId = jobDetailsForComments.product?.artistUserId;
        const isCurrentUserTheArtist = userId === productArtistUserId;

        if (isCurrentUserTheArtist) {
          const commentsFilter = {
            authorUserIds: [productArtistUserId],
            jobUid,
            jobCommentType: JobCommentTypeEnum.ARTIST_COMMENT,
          };
          const result = await JobComment.scope({ method: ['commentsForJob', commentsFilter] }).findAll();
          const data = result.map((r: any) => r.toJSON());
          const comments = Helpers.filterDeletedComments(data);
          return res.json({ artist: comments });
        } else {
          return res.status(403).send('Unauthorized. Current user is not  the artist.');
        }
      } catch (err) {
        Errors.resJson(res, err as Error, 'unable to load comments for artist');
      }
    } else {
      res.status(403).send('Unauthorized. User is not admin.');
    }
  },
);

Router.options('/client', studioCors);
Router.get(
  '/client',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      const jobUid = req.params.jobUid,
        userId = req.user.id;
      try {
        const jobDetailsForComments = await Job.scope({ method: ['forComments', jobUid] }).findOne();
        if (!jobDetailsForComments) {
          throw new Error('cannot find job details for comments');
        }
        const userClients = await UserClient.findAll({ where: { clientId: jobDetailsForComments.clientId } });
        // Client relationship
        const clientUserIds = userClients.map(({ userId }) => userId);
        const isCurrentUserAClient = clientUserIds.includes(userId);

        if (isCurrentUserAClient) {
          const commentsFilter = {
            authorUserIds: clientUserIds,
            jobUid,
            jobCommentType: JobCommentTypeEnum.CLIENT_COMMENT,
          };
          const result = await JobComment.scope({ method: ['commentsForJob', commentsFilter] }).findAll();
          const data = result.map((r: any) => r.toJSON());
          const comments = Helpers.filterDeletedComments(data);

          return res.json({ client: comments });
        } else {
          return res.status(403).send('Unauthorized. Current user is not a member of client.');
        }
      } catch (err) {
        Errors.resJson(res, err as Error, 'unable to load comments for client');
      }
    } else {
      res.status(403).send('Unauthorized. User is not admin.');
    }
  },
);

Router.options('/qa', studioCors);
Router.get(
  '/qa',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    const { jobUid } = req.params;
    try {
      const jobDetailsForComments = await Job.scope({ method: ['forComments', jobUid] }).findOne();
      if (!jobDetailsForComments) {
        throw new Error('cannot find job details for comments');
      }
      // Retrieve artist comments
      const productArtistUserId = jobDetailsForComments.product?.artistUserId;
      const commentsArtistFilter = {
        authorUserIds: [productArtistUserId],
        jobUid,
        jobCommentType: JobCommentTypeEnum.ARTIST_COMMENT,
      };
      const commentsArtist = await JobComment.scope({ method: ['commentsForJob', commentsArtistFilter] }).findAll();
      const commentsArtistData = commentsArtist.map(comments => comments.toJSON());
      const artist = Helpers.filterDeletedComments(commentsArtistData);

      // Retrieve client comments
      const userClientsAssociations = await UserClient.findAll({
        where: { clientId: jobDetailsForComments.clientId },
      });
      const clientUserIds = userClientsAssociations.map(({ userId }) => userId);
      const commentsFilterClient = {
        authorUserIds: clientUserIds,
        jobUid,
        jobCommentType: JobCommentTypeEnum.CLIENT_COMMENT,
      };
      const commentsClients = await JobComment.scope({ method: ['commentsForJob', commentsFilterClient] }).findAll();
      const commentsClientsData = commentsClients.map(comments => comments.toJSON());
      const client = Helpers.filterDeletedComments(commentsClientsData);
      res.json({ artist, client });
    } catch (err) {
      Errors.resJson(res, err as Error, 'unable to load comments for qa');
    }
  },
);

Router.options('/admin', studioCors);
Router.get(
  '/admin',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    const jobUid = req.params.jobUid;
    if (req.user?.admin) {
      try {
        const jobDetailsForComments = await Job.scope({ method: ['forComments', jobUid] }).findOne();
        if (!jobDetailsForComments) {
          throw new Error('cannot find job details for comments');
        }
        // Retrieve artist comments
        const productArtistUserId = jobDetailsForComments.product?.artistUserId;
        const commentsArtistFilter = {
          authorUserIds: [productArtistUserId],
          jobUid,
          jobCommentType: JobCommentTypeEnum.ARTIST_COMMENT,
        };
        const commentsArtist = await JobComment.scope({ method: ['commentsForJob', commentsArtistFilter] }).findAll();
        const commentsArtistData = commentsArtist.map((comments: any) => comments.toJSON());
        const artist = Helpers.filterDeletedComments(commentsArtistData);

        // Retrieve client comments
        const userClientsAssociations = await UserClient.findAll({
          where: { clientId: jobDetailsForComments.clientId },
        });
        const clientUserIds = userClientsAssociations.map(({ userId }) => userId);
        const commentsFilterClient = {
          authorUserIds: clientUserIds,
          jobUid,
          jobCommentType: JobCommentTypeEnum.CLIENT_COMMENT,
        };
        const commentsClients = await JobComment.scope({ method: ['commentsForJob', commentsFilterClient] }).findAll();
        const commentsClientsData = commentsClients.map((comments: any) => comments.toJSON());
        const client = Helpers.filterDeletedComments(commentsClientsData);
        res.json({ artist, client });
      } catch (err) {
        Errors.resJson(res, err as Error, 'unable to load comments for admin');
      }
    } else {
      res.status(403).send('Unauthorized. User is not admin.');
    }
  },
);

Router.options('/studio', studioCors);
Router.get(
  '/studio',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    const jobUid = req.params.jobUid;
    try {
      const jobDetailsForComments = await Job.scope({ method: ['forComments', jobUid] }).findOne();
      if (!jobDetailsForComments) {
        throw new Error('cannot find job details for comments');
      }
      // Retrieve artist comments
      const productArtistUserId = jobDetailsForComments.product?.artistUserId;
      const commentsArtistFilter = {
        authorUserIds: [productArtistUserId],
        jobUid,
        jobCommentType: JobCommentTypeEnum.ARTIST_COMMENT,
      };
      const commentsArtist = await JobComment.scope({ method: ['commentsForJob', commentsArtistFilter] }).findAll();
      const commentsArtistData = commentsArtist.map((comments: any) => comments.toJSON());
      const artist = Helpers.filterDeletedComments(commentsArtistData);

      // Retrieve client comments
      const userClientsAssociations = await UserClient.findAll({
        where: { clientId: jobDetailsForComments.clientId },
      });
      const clientUserIds = userClientsAssociations.map(({ userId }) => userId);
      const commentsFilterClient = {
        authorUserIds: clientUserIds,
        jobUid,
        jobCommentType: JobCommentTypeEnum.CLIENT_COMMENT,
      };
      const commentsClients = await JobComment.scope({ method: ['commentsForJob', commentsFilterClient] }).findAll();
      const commentsClientsData = commentsClients.map((comments: any) => comments.toJSON());
      const client = Helpers.filterDeletedComments(commentsClientsData);
      res.json({ artist, client });
    } catch (err) {
      Errors.resJson(res, err as Error, 'unable to load comments for admin');
    }
  },
);

Router.options('/create', studioCors);
Router.post(
  '/create',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    debugger;
    if (req.user) {
      const authorUserId: number = req.user.id;
      const { content, jobCommentType, jobId, jobUid, parentCommentId } = req.body;
      debugger;
      try {
        const jobDetailsForComments = await Job.scope({ method: ['forComments', jobUid] }).findOne();
        if (!jobDetailsForComments) {
          throw new Error('cannot find job details for comments');
        }

        const isCommentTypeArtist = jobCommentType === JobCommentTypeEnum.ARTIST_COMMENT;
        const createdCommentResult = await JobComment.bulkCreate([
          { content, jobUid, jobCommentType, parentCommentId, userId: authorUserId },
        ]);
        const notificationFields = {
          jobId,
          jobCommentId: createdCommentResult[0].id,
          refUserId: authorUserId,
          projectId: jobDetailsForComments.projectId,
          productId: jobDetailsForComments.product?.id,
          notificationTypeId: isCommentTypeArtist
            ? NotificationTypeEnum.JOB_COMMENT_ADDED_ARTIST
            : NotificationTypeEnum.JOB_COMMENT_ADDED_CLIENT,
        } as INotificationWithoutRecipient;

        if (isCommentTypeArtist) {
          sendNotificationsToJobArtistsAndAdmins(jobUid, notificationFields, authorUserId);
        } else {
          sendNotificationsToJobClientsAndAdmins(jobUid, notificationFields, authorUserId);
        }

        if (req.user.admin) {
          const userClients = await UserClient.findAll({ where: { clientId: jobDetailsForComments.clientId } });
          const users = await Promise.all(
            userClients.map(async ({ userId }) => await User.findOne({ where: { id: userId } })),
          );
          const product = await Product.findOne({ where: { id: jobDetailsForComments.product?.id } });
          const commentator = await User.findByPk(req.user.id);
          const fullName = `${commentator?.firstName} ${commentator?.lastName}`;
          // Defaults to '3XR user' if both firstName and lastName are not present
          const commentatorName = fullName.trim() ? fullName : '3XR user';

          if (!product) {
            throw new Error(`could not find product for id: ${jobDetailsForComments.product?.id}`);
          }

          const templateRequests: TemplateRequest[] = users.filter(helpers.notNullPredicate).map(user => {
            return {
              type: EmailType.COMMENT,
              user,
              product: {
                name: product.name,
                href: `https://www.3xr.com/product/details/${product.uid}#comment-${createdCommentResult[0].id}`,
              },
              bcc: [],
              commentatorName,
            };
          });

          const emailRequests = await Email.generateTemplates(templateRequests);
          if (emailRequests) {
            await Email.sendEmails(emailRequests);
          }
        }

        res.json(createdCommentResult);
      } catch (err) {
        Errors.resJson(res, err as Error, 'unable to create comment');
      }
    } else {
      res.status(403).send('unauthorized');
    }
  },
);

Router.options('/update/:commentId', studioCors);
Router.post(
  '/update/:commentId',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      const commentId = req.params.commentId;
      const userId = req.user.id;
      const { content, deleted } = req.body;
      try {
        const result = await JobComment.update(
          { content, deleted },
          {
            where: {
              userId: userId,
              id: commentId,
            },
          },
        );
        res.json(result);
      } catch (err) {
        Errors.resJson(res, err as Error, 'unable to update comment');
      }
    } else {
      res.status(403).send('unauthorized');
    }
  },
);

Router.options('/mark_deleted/:commentId', studioCors);
Router.post(
  '/mark_deleted/:commentId',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      const commentId = req.params.commentId;
      const userId = req.user.id;
      try {
        const result = await JobComment.update(
          { deleted: true },
          {
            where: {
              userId: userId,
              id: commentId,
            },
          },
        );
        res.json(result);
      } catch (err) {
        Errors.resJson(res, err as Error, 'unable to delete comment');
      }
    } else {
      res.status(403).send('unauthorized');
    }
  },
);

module.exports = Router;
