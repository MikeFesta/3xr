// SPDX-License-Identifier: Apache-2.0
import { decodeToken, generateToken } from '@root/services/OAuth';

describe('generateToken', () => {
  it('should encode user data in generated signed JWT', () => {
    const user = {
      username: 'foo',
      storeHash: 'storeHash',
    };
    const jwt = generateToken(user, undefined, 'secret');

    const decodedToken = decodeToken(jwt, undefined, 'secret');
    expect(decodedToken?.user).toStrictEqual(user);
  });
});

describe('verifyToken', () => {
  it('should correctly detect token was not tempered with', () => {
    const jwt = generateToken(
      {
        username: 'foo',
        storeHash: 'storeHash',
      },
      undefined,
      'secret',
    );
    const maliciouslyUpdatedToken = `${jwt.slice(0, -1)}!`;

    try {
      decodeToken(maliciouslyUpdatedToken, undefined, 'secret');
    } catch (err) {
      expect((err as Error).message).toBe('invalid token');
    }
  });
});
