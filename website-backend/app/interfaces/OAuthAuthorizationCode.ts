// SPDX-License-Identifier: Apache-2.0
export interface OAuthAuthorizationCodeCreationAttributes {
  userId: number;
  oauthClientId: string;
  authorizationCode: string;
}

export interface OAuthAuthorizationCodeAttributes extends OAuthAuthorizationCodeCreationAttributes {
  id: number;
}
