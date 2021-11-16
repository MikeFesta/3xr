// SPDX-License-Identifier: Apache-2.0
import { hash, compare } from 'bcryptjs';
import { STRING, BOOLEAN, INTEGER, Op, col, where, fn, Model, BuildOptions } from 'sequelize';
import { UserAttributes, UserStudioDetailsI, UserCreationAttributes } from '@types';
import { RoleEnum } from '@enums';
import Helpers from '@root/helpers';
import * as mailer from '@root/mailer';
import { sql } from '@root/sql';

import Log from '@root/log';

export interface UserInstance extends Model<UserAttributes, UserCreationAttributes>, UserAttributes {
  setPassword(password: string): Promise<UserInstance[]>;
  getUserInfoForStudioLogin(): UserStudioDetailsI;
  getPublicInfo(): UserPublicInfo;
}

export type UserModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): UserInstance;
  getUserById(id: number): Promise<UserAttributes>;
  generateApiToken(userId: number): Promise<string>;
  forgotPassword(email: string): Promise<string>;
  getUserForPasswordResetToken(compoundToken: string): Promise<UserInstance>;
  getPrivateData(userId: number): Promise<Model<UserAttributes, UserCreationAttributes> | null>;
  search(query: string): Promise<any>;
  searchArtists(query: string): Promise<any>;
  validatePassword(userId: number, password: string): Promise<boolean>;
  findAllByLastName(): Promise<UserInstance[]>;
  getAdminInfoForUser(user_id: number): Promise<any>;
  isUsernameAvailable(username: string): Promise<boolean>;
  isEmailAvailable(email: string): Promise<boolean>;
  getResetPasswordToken(userId: number): Promise<string>;
  createArtist(username: string, email: string): Promise<{ user: UserAttributes; resetPasswordToken: string }>;
  adminInsert(
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
    artist_flag: boolean,
  ): Promise<{ created: boolean; id: number }>;
  validateUsername(username: string): boolean;
  validateEmail(email: string): boolean;
};

export const User = sql.define(
  'user',
  {
    admin: {
      type: BOOLEAN,
      defaultValue: false,
    },
    apiToken: {
      type: STRING,
      unique: true,
    },
    artist: {
      type: BOOLEAN,
      defaultValue: false,
    },
    email: {
      type: STRING,
      allowNull: false,
    },
    emailNotifications: {
      type: BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    firstName: STRING,
    hash: {
      type: STRING,
      allowNull: false,
    },
    lastName: STRING,
    phone: STRING,
    primaryRoleId: INTEGER,
    qaViewer: {
      type: INTEGER,
      defaultValue: 1
    },
    resetPasswordHash: {
      type: STRING,
    },
    username: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    getterMethods: {
      // TODO: move this to the frontend only (unless it is helpful for emails .. ?)
      fullName: function (this: { firstName: string | null; lastName: string | null }) {
        if (this.firstName && this.lastName) {
          return [this.firstName, this.lastName].join(' ');
        } else {
          null;
        }
      },
    } as any,
    defaultScope: {
      // Exclude some private data that must be loaded intentionally
      attributes: {
        exclude: ['hash', 'apiToken'],
      },
    },
    scopes: {
      adminScope: {
        where: { admin: true },
      },
      artist: {
        where: { artist: true },
      },
      basic: {
        attributes: ['firstName', 'id', 'lastName', 'username'],
      },
      card: {
        attributes: ['username', 'firstName', 'lastName'],
      },
      forComments: {
        attributes: ['admin', 'id', 'firstName', 'lastName', 'username', 'primaryRoleId'],
      },
      forNotifications: {
        attributes: ['admin', 'id', 'username', 'firstName', 'lastName'],
      },
      forPurchaseOrderProductsAsArtist: {
        attributes: ['id', 'username'],
      },
      // Only get access to the hash when needed
      fullScope: {
        attributes: {
          include: [],
          exclude: [],
        },
      },
      name: {
        attributes: ['firstName', 'lastName', 'username'],
      },
      personalScope: {
        attributes: {
          exclude: ['hash'],
        },
      },
      withEmail: {
        attributes: ['email'],
      }
    },
  },
) as UserModelStatic;

export default User;

// Additional dependancies that would be cyclic
import { Client } from '@models/client';
import { IPLog } from '@models/ip_log';
import { LoginToken } from '@models/login_token';
import { Product } from '@models/product';
import { ProductFavorite } from '@models/product_favorite';
import { Role } from '@models/role';
import { Studio } from '@models/studio';
import { UserClient } from '@models/user_client';
import { UserPublicInfo } from '3xr_types';
import { UserStudio } from '@models/user_studio';
import { UserRole } from '@models/user_role';

// Scopes with includes
User.addScope('adminSearch', {
  include: [
    {
      as: 'primaryRole',
      model: Role,
    },
    {
      as: 'clients',
      model: Client,
    },
  ],
  order: [['id', 'DESC']],
});

User.addScope('forClient', (clientId) => ({
  include: [
    {
      as: 'clients',
      attributes: [],
      model: Client,
      where: {
        id: clientId
      }
    },
  ],
  order: [['username', 'ASC']],
}));

User.addScope('forStudio', (studioId) => ({
  include: [
    {
      as: 'studios',
      attributes: [],
      model: Studio,
      where: {
        id: studioId
      }
    },
  ],
}));

User.addScope('findByUsernameCaseInsensitive', (username: string) => ({
  where: {
    username: where(fn('LOWER', col('username')), 'LIKE', username.toLowerCase()),
  }
}));

User.addScope('picklist', {
  attributes: ['id', 'firstName', 'lastName', 'username', 'email'],
  order: [['lastName', 'ASC']],
});

// Joins
User.belongsToMany(Client, { as: 'clients', through: UserClient });
User.belongsToMany(Studio, { as: 'studios', through: UserStudio });
User.belongsToMany(Product, { as: 'favorites', through: ProductFavorite });

User.hasOne(Role, {
  as: 'primaryRole',
  foreignKey: 'id',
  sourceKey: 'primaryRoleId',
});

User.belongsTo(IPLog, {
  constraints: false,
  foreignKey: 'id',
});

User.hasMany(LoginToken, {
  as: 'loginTokens',
  foreignKey: 'userId',
  sourceKey: 'id',
});

User.belongsToMany(Role, { as: 'roles', through: UserRole });

User.getUserById = (id: number) => {
  return new Promise((resolve, reject) => {
    User.findByPk(id)
      .then((user: any) => {
        resolve(user);
      })
      .catch((err: Error) => {
        Log.error('Error de-serializing user with id ' + id);
        reject(err);
      });
  });
};

User.generateApiToken = (userId: number) => {
  return new Promise((resolve, reject) => {
    hash(Helpers.getRandomString(12), 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      User.update({ apiToken: hash }, { where: { id: userId } })
        .then((result: any) => {
          resolve(hash);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  });
};

User.forgotPassword = (email: string) => {
  return new Promise((resolve, reject) => {
    User.scope('fullScope')
      .findOne({ where: { email: email } })
      .then(user => {
        if (user) {
          User.getResetPasswordToken(user.id)
            .then(token => {
              const passwordLink = 'http://www.3xr.com/user/set-password/' + user.id + '+' + token;
              const text =
                'The password for your 3xr.com account, ' +
                user.username +
                ', can be reset by following this link: ' +
                passwordLink;
              const html =
                '<p>The password for your 3xr.com account (<strong>' +
                user.username +
                '</strong>) can be reset by following this link: <a href="' +
                passwordLink +
                '">' +
                passwordLink +
                '</a></p>';
              mailer
                .sendMessageToOrganization(user.email, '3XR Password Reset', text, html)
                .then(mail_result => {
                  if (mail_result.accepted.includes(user.email)) {
                    resolve('Password Reset Email Sent');
                  } else {
                    reject('Error sending email');
                  }
                })
                .catch((err: Error) => {
                  Log.error('Reset Password Error: ' + err);
                  reject('Error sending email');
                });
            })
            .catch((err: Error) => {
              reject('Error getting reset token');
            });
        }
      })
      .catch((err: Error) => {
        reject('User not found for email');
      });
  });
};

User.getUserForPasswordResetToken = (compoundToken: string) => {
  return new Promise((resolve, reject) => {
    const id = compoundToken.split('+')[0];
    const token = compoundToken.split('+')[1];
    User.scope('personalScope')
      .findByPk(id)
      .then(user => {
        if (user) {
          compare(token, user.resetPasswordHash!)
            .then(result => {
              if (result) {
                resolve(user);
              } else {
                Log.error('Token does not match hash ' + token);
                reject();
              }
            })
            .catch((err: Error) => {
              Log.error('Token does not match hash ' + token);
              reject();
            });
        } else {
          Log.error('no user found with token ' + token);
          reject();
        }
      })
      .catch((err: Error) => {
        Log.error('Error getting username from token: ' + err);
        reject();
      });
  });
};

User.getPrivateData = (userId: number) => {
  // TODO: change this to use scopes and make it a prototype
  return User.findOne({
    attributes: ['apiToken', 'email'],
    where: { id: userId },
  });
};

User.search = (query: string) => {
  return User.scope('card').findAll({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: '%' + query + '%' } },
        { firstName: { [Op.iLike]: '%' + query + '%' } },
        { lastName: { [Op.iLike]: '%' + query + '%' } },
      ],
    },
  });
};

User.searchArtists = (query: string) => {
  return User.scope(['artist', 'card']).findAll({
    where: {
      [Op.or]: [
        { username: { [Op.iLike]: '%' + query + '%' } },
        { firstName: { [Op.iLike]: '%' + query + '%' } },
        { lastName: { [Op.iLike]: '%' + query + '%' } },
      ],
    },
  });
};

User.prototype.getPublicInfo = function (): UserPublicInfo {
  return {
    username: this.username,
  };
};

User.prototype.getUserInfoForStudioLogin = function () {
  return {
    id: this.id,
    username: this.username,
    firstName: this.firstName,
    lastName: this.lastName,
    email: this.email,
    phone: this.phone,
    admin: this.admin,
    artist: this.artist,
    primaryRoleId: this.primaryRoleId,
    emailNotifications: this.emailNotifications,
  };
};

User.prototype.setPassword = function (password: string): Promise<UserInstance[]> {
  const user_id = this.id;
  return new Promise((resolve, reject) => {
    hash(password, 10, (err, hash) => {
      if (err) {
        Log.error('unable to crypt password');
        reject(err);
      }
      User.update({ hash: hash, resetPasswordHash: '' }, { returning: true, where: { id: user_id } })
        .then(result => {
          // Result structure: [rows_updated, [User]]
          resolve(result[1]);
        })
        .catch((err: Error) => {
          Log.error('Error setting password in user.ts');
          Log.error(err.message);
          reject(err);
        });
    });
  });
};

User.validatePassword = (userId: number, password: string) => {
  return new Promise((resolve, reject) => {
    User.scope('fullScope')
      .findOne({
        where: {
          id: userId,
        },
      })
      .then(user => {
        if (!user) {
          // No Match
          reject();
        } else {
          compare(password, user.hash)
            .then(result => {
              resolve(result);
            })
            .catch((err: Error) => {
              reject('Bcrypt error hashing password');
            });
        }
      })
      .catch((err: Error) => {
        reject('There was an error checking the password');
      });
  });
};

User.findAllByLastName = () => {
  return User.findAll({
    order: [['lastName', 'ASC']],
  });
};

User.getAdminInfoForUser = (user_id: number) => {
  return new Promise((resolve, reject) => {
    IPLog.findAll({
      attributes: [
        [col('user.username'), 'username'],
        [col('user.email'), 'email'],
        [col('user.first_name'), 'first_name'],
        [col('user.last_name'), 'last_name'],
        [col('user.created_at'), 'member_since'],
        [col('ip_log.ip'), 'ip_address'],
        [col('ip_log.created_at'), 'last_login'],
      ] as any[],
      include: [
        {
          as: 'user',
          attributes: [],
          model: User,
          required: true,
        },
      ],
      limit: 1,
      order: [[col('ip_log.created_at'), 'DESC']],
      raw: true,
      where: { user_id: user_id },
    })
      .then(result => {
        resolve(result[0]);
      })
      .catch((err: Error) => {
        Log.error('Error getting admin info about user id ' + user_id);
        Log.error(err.message);
        reject();
      });
  });
};

User.isUsernameAvailable = (username: string) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: ['username'],
      where: {
        username: where(fn('LOWER', col('username')), 'LIKE', username.toLowerCase()),
      },
    })
      .then(results => {
        resolve(!results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

User.isEmailAvailable = (email: string) => {
  return new Promise((resolve, reject) => {
    User.findOne({
      attributes: ['email'],
      where: {
        email: where(fn('LOWER', col('email')), 'LIKE', email.toLowerCase()),
      },
    })
      .then(results => {
        resolve(!results);
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
};

User.getResetPasswordToken = (userId: number) => {
  return new Promise((resolve, reject) => {
    const token = Helpers.getRandomString(12);
    hash(token, 10, (err, hash) => {
      if (err) {
        reject(err);
      }
      // Save token hash
      User.update({ resetPasswordHash: hash }, { returning: true, where: { id: userId } })
        .then(result => {
          // return random token
          resolve(token);
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  });
};

User.createArtist = (username: string, email: string) => {
  return new Promise((resolve, reject) => {
    User.isUsernameAvailable(username)
      .then(username_available => {
        if (!username_available) {
          reject('Username ' + username + ' is unavailable');
        } else {
          User.isEmailAvailable(email)
            .then(email_available => {
              if (!email_available) {
                reject('Email ' + email + ' is already in use');
              } else {
                User.create({
                  username: username,
                  email: email,
                  firstName: '',
                  lastName: '',
                  hash: '',
                  artist: true,
                })
                  .then(user => {
                    // Reset the Password
                    User.getResetPasswordToken(user.id)
                      .then(token => {
                        UserRole.create({
                          userId: user.id,
                          roleId: RoleEnum.ARTIST,
                        })
                          .then(role => {
                            resolve({ user, resetPasswordToken: token });
                          })
                          .catch((err: Error) => {
                            Log.error('Unable to create artist role');
                            Log.error(err.message);
                            reject('Unable to assign artist role');
                          });
                      })
                      .catch((err: Error) => {
                        reject(err);
                      });
                  })
                  .catch(err => {
                    reject(err);
                  });
              }
            })
            .catch((err: Error) => {
              Log.error('unable to check for duplicate email');
              reject(err);
            });
        }
      })
      .catch((err: Error) => {
        Log.error('unable to check for username availability');
        reject(err);
      });
  });
};

User.adminInsert = (
  username: string,
  email: string,
  first_name: string,
  last_name: string,
  password: string,
  artist_flag: boolean,
) => {
  return new Promise((resolve, reject) => {
    User.count({ where: { username: username } })
      .then(has_duplicate => {
        if (has_duplicate) {
          // If there is a duplicate already, return that id
          User.findOne({
            where: { username: username },
          })
            .then(duplicate => {
              if (duplicate) {
                resolve({ created: false, id: duplicate.id });
              }
            })
            .catch((err: Error) => {
              Log.error('A user with username ' + username + ' already exists');
              reject('The username ' + username + ' is already in use');
            });
        } else {
          return new Promise((resolve, reject) => {
            hash(password, 10, (err, hash) => {
              if (err) {
                reject(err);
              }
              User.create({
                username: username,
                email: email,
                firstName: first_name,
                lastName: last_name,
                hash: hash,
                artist: artist_flag,
              })
                .then(result => {
                  resolve({ created: true, id: result.id });
                })
                .catch(err => {
                  reject(err);
                });
            });
          }).then((result: any) => {
            resolve(result);
          });
        }
      })
      .catch((err: Error) => {
        Log.error('unable to check for duplicate user');
        reject();
      });
  });
};

User.validateUsername = (username: string) => {
  const invalidUsernamePattern = new RegExp('[^a-zA-Z0-9]');
  return !invalidUsernamePattern.test(username);
};

User.validateEmail = (email: string) => {
  const emailPattern = new RegExp('^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$');
  return emailPattern.test(email);
};
