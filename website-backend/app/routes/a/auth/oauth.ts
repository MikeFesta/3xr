// SPDX-License-Identifier: Apache-2.0
import studioCors from '@root/cors/studio';
import OAuthAuthorizationCode from '@root/models/oauth/oauth_authorization_code';
import OAuthClient from '@root/models/oauth/oauth_client';
import User from '@root/models/user';
import { decodeToken, generateToken } from '@root/services/OAuth';
import express from 'express';
import Passport from 'passport';
import sequelize from 'sequelize';

const Router = express.Router();

// Generates authorization code token for locally authenticated users. Auth code is stored for later comparison
Router.options('/authorize', studioCors);
Router.post(
  '/authorize',
  studioCors,
  Passport.authenticate('local', { failureRedirect: '/a/user/invalid_login' }),
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { redirect_uri, client_id, store_hash } = req.query;

    try {
      if (!client_id || typeof client_id !== 'string') {
        throw new Error('missing or invalid client id');
      }

      if (!store_hash || typeof store_hash !== 'string') {
        throw new Error('missing or invalid store hash');
      }

      if (!req.user) {
        throw new Error('could not find user');
      }

      const user = await User.scope('personalScope').findOne({
        where: {
          username: sequelize.where(
            sequelize.fn('lower', sequelize.col('username')),
            '=',
            req.user.username.toLowerCase(),
          ),
        },
      });
      if (user) {
        const payload = {
          ...user.getPublicInfo(),
          storeHash: store_hash,
        };
        const authorizationCode = generateToken(payload, {
          expiresIn: '5m',
        });

        const currentAuthCode = await OAuthAuthorizationCode.findOne({
          where: {
            userId: user.id,
          },
        });

        // update or save auth code for later comparison
        if (currentAuthCode) {
          currentAuthCode.authorizationCode = authorizationCode;
          await currentAuthCode.save();
        } else {
          await OAuthAuthorizationCode.create({
            userId: user.id,
            oauthClientId: client_id,
            authorizationCode,
          });
        }

        const redirectUri = `${redirect_uri}?store=${store_hash}`;

        res.json({ redirectUri, authorizationCode });
      }
    } catch (err) {
      console.error(err);
      res.status(401).send('unauthorized');
    }
  },
);

// Checks validity of authorization code, client id and client secret and if valid, issues access token
Router.options('/token', studioCors);
Router.post('/token', async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { authorization_code: authorizationCode, client_id: oauthClientId, client_secret: clientSecret } = req.body;

  try {
    // check auth code is valid
    const authCode = await OAuthAuthorizationCode.findOne({ where: { authorizationCode, oauthClientId } });
    if (!authCode) {
      throw new Error('invalid authorization code');
    }

    // check client_secret matches
    const authClient = await OAuthClient.findOne({ where: { clientId: oauthClientId, clientSecret } });
    if (!authClient) {
      throw new Error('wrong client credentials');
    }

    // decode authorization code to get user details
    const decodedAuthCode = decodeToken(authCode.authorizationCode);
    const { username, storeHash } = decodedAuthCode.user;

    const user = await User.findOne({ where: { username } });
    if (!user) {
      throw new Error('no user');
    }

    const payload = {
      ...user.getPublicInfo(),
      storeHash,
    };
    const accessToken = generateToken(payload);

    res.json({ accessToken });
  } catch (err) {
    res.status(401).send((err as Error).message);
  }
});

module.exports = Router;
