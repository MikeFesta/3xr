// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { UserAgreementTypeEnum } from '@enums';
import { UserAgreementResponse } from '@models/user_agreement_response';
import { UserAgreement } from '@models/user_agreement';
import { UserAgreementType } from '@models/user_agreement_type';
import Helpers from '@root/helpers';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);
Router.get('/',
  studioCors,
  async (req: express.Request, res: express.Response) => {
    try {
      const userAgreementTypes = await UserAgreementType.findAll();
      const userAgreementsOrNull = await Promise.all(userAgreementTypes.map((userAgreementType) => {
        return UserAgreement.findOne({
          limit: 1,
          order: [['version', 'DESC']],
          where: { userAgreementTypeId: userAgreementType.id },
        });
      }));
      const userAgreements = userAgreementsOrNull.filter(Helpers.notNullPredicate);
      res.status(200).send(userAgreements);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

Router.options('/privacy_policy/latest', studioCors);
Router.get('/privacy_policy/latest',
  studioCors,
  async (req: express.Request, res: express.Response) => {
    try {
      const latestVersionOfAgreement = await UserAgreement.findOne({
        limit: 1,
        order: [['version', 'DESC']],
        where: { userAgreementTypeId: UserAgreementTypeEnum.PRIVACY_POLICY },
      });
      res.status(200).send(latestVersionOfAgreement);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

Router.options('/terms_of_service/latest', studioCors);
Router.get('/terms_of_service/latest',
  studioCors,
  async (req: express.Request, res: express.Response) => {
    try {
      const latestVersionOfAgreement = await UserAgreement.findOne({
        limit: 1,
        order: [['version', 'DESC']],
        where: { userAgreementTypeId: UserAgreementTypeEnum.TERMS_OF_SERVICE },
      });
      res.status(200).send(latestVersionOfAgreement);
    } catch (error) {
      res.status(500).send(error);
    }
  },
);

Router.options('/responses', studioCors);
Router.get('/responses',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      try {
        const userId = req.user.id;
        const userAgreementTypes = await UserAgreementType.findAll();
        const userAgreementsOrNull = await Promise.all(userAgreementTypes.map((userAgreementType) => {
          return UserAgreement.findOne({
            limit: 1,
            order: [['version', 'DESC']],
            where: { userAgreementTypeId: userAgreementType.id },
          });
        }));
        const userAgreements = userAgreementsOrNull.filter(Helpers.notNullPredicate);
        const userAgreementResponsesOrNull = await Promise.all(userAgreements.map((latestVersionOfUserAgreement) => {
          return UserAgreementResponse.findOne({
            where: {
              userAgreementId: latestVersionOfUserAgreement.id,
              userId
            },
          });
        }));
        const userAgreementResponses = userAgreementResponsesOrNull.filter(Helpers.notNullPredicate);
        res.status(200).send(userAgreementResponses);
      } catch (error) {
        res.status(500).send(error);
      }
    } else {
      res.status(403).send('Unauthorized. User is authenticated.');
    }
  },
);

Router.options('/submit_response', studioCors);
Router.post('/submit_response',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user) {
      const response = req.body.response;
      const userAgreementId = req.body.userAgreementId as number;
      const userId = req.user.id;
      const userAgreement = await UserAgreement.findOne({ where: { id: userAgreementId } });
      if (userAgreement) {
        const existingResponse = await UserAgreementResponse.findOne({ where: { userAgreementId, userId } });
        if (!existingResponse) {
          await UserAgreementResponse.create({ response, userAgreementId, userId });
        } else {
          existingResponse.response = response;
          existingResponse.save();
        }
        res.status(200).send('Submitted.');
      } else {
        res.status(500).send(`User agreement with an id of  "${userAgreementId}" does not exist.`);
      }
    } else {
      res.status(403).send('Unauthorized. User is authenticated.');
    }
  },
);

module.exports = Router;
