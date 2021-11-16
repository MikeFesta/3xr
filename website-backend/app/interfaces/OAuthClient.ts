// SPDX-License-Identifier: Apache-2.0
export interface OAuthClientCreationAttributes {
  clientId: string;
  clientSecret: string;
}

export interface OAuthClientAttributes extends OAuthClientCreationAttributes {
  id: number;
}
