// SPDX-License-Identifier: Apache-2.0
/*
OAuth 2.0 Authorization Code flow:

1) The client prepares a link to the authorization server and opens the link for user in a user agent (browser).
   The link includes information that allows the authorization server to identify and respond to the client.
2) User enters their credentials on the new page.
3) Credentials are sent to authorization server via the user agent (browser).
4) The authorization server validates the credentials and redirects user back to the client with an authorization code.
5) The client talks with the authorization server, confirms its identify and exchanges the authorization code for an
access token and optionally a refresh token.
6) The client uses the access token to access resources on the resource server.

graph: https://miro.medium.com/max/700/1*GuRtWHB0-xMPgSsJFtSz_w.png
*/

import jwt, { SignOptions, VerifyOptions } from 'jsonwebtoken';
import { UserPublicInfo } from '3xr_types';

type Token = string;
export interface DecodedToken {
  user: UserPublicInfo & { storeHash: string };
  iat: string;
  aud: 'www.3xr.com';
  exp: string;
}

// used to generate authorization code token and access token.
export function generateToken(
  user: UserPublicInfo & { storeHash: string },
  opts?: SignOptions,
  secret?: string,
): Token {
  const defaultOpts = {
    expiresIn: '1 day',
    audience: 'www.3xr.com',
  };
  const jwtSecret = process.env.JWT_SECRET || (secret as string);
  return jwt.sign({ user }, jwtSecret, opts || defaultOpts);
}

export function decodeToken(token: string, opts?: VerifyOptions, secret?: string): DecodedToken {
  const jwtSecret = process.env.JWT_SECRET || (secret as string);
  return jwt.verify(token, jwtSecret, opts || undefined) as unknown as DecodedToken;
}
