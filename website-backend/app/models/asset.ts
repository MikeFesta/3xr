// SPDX-License-Identifier: Apache-2.0
import Sequelize, { Model, BuildOptions } from 'sequelize';
import { AssetComplexityType } from '@models/asset_complexity_type';
import { AssetAttributes, AssetCreationAttributes } from '@types';
import { AssetComplexityTypeEnum } from '@enums';
import Helpers from '@root/helpers';
import { sql } from '@root/sql';

import Log from '@root/log';
import Errors from '@root/errors';

export interface AssetInstance extends Model<AssetAttributes, AssetCreationAttributes>, AssetAttributes {}

type AssetModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): AssetInstance;
  findAllForStudio(): Promise<any>;
  adminInsert(name: string): Promise<{ created: boolean; id: number }>;
  createForProduct(productId: number): Promise<any>;
  findAllWithoutProducts(): Promise<any>;
};

export const Asset = sql.define(
  'asset',
  {
    allowDownload: {
      // Not in use
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    bannerButtonText: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    cameraOrbit: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    cameraTarget: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    complexityId: {
      // Not in use
      type: Sequelize.INTEGER,
      defaultValue: AssetComplexityTypeEnum.MEDIUM,
      allowNull: false,
    },
    delete: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    exposure: {
      type: Sequelize.FLOAT,
      allowNull: true,
      defaultValue: 0.8,
    },
    hdr: {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: 'custom_3xr_v2',
    },
    // TODO: light count, triange count, HxWxD, etc. should be copied over from asset_submission
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    publishDate: {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: null,
    },
    published: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    probabilityWeight: {
      type: Sequelize.INTEGER,
      defaultValue: 1,
    },
    productName: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    productPrice: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    productSubtitle: {
      type: Sequelize.STRING,
      defaultValue: '',
    },
    productUrl: {
      // Used for AR Quick Look Buy Now Banner
      type: Sequelize.STRING,
      allowNull: true,
    },
    rating: {
      // Not yet in use
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    shadowIntensity: {
      type: Sequelize.FLOAT,
      defaultValue: 0.8,
      allowNull: true,
    },
    showBanner: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    showOptions: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    uid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    scopes: {
      basic: {
        attributes: ['allowDownload', 'cameraOrbit', 'cameraTarget', 'hdr', 'id', 'name', 'published', 'uid'],
      },
      detailsForUnity: {
        attributes: ['name', 'uid'],
      },
    },
  },
) as AssetModelStatic;

export default Asset;

// Additional Includes
import { AssetAbAlternative } from '@models/asset_ab_alternative';
import { AssetFile } from '@models/asset_file';
import { AssetRender } from '@models/asset_render';
import { AssetSpinSet } from '@models/asset_spin_set';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionStatusType } from '@models/asset_submission_status_type';
import { AssetTag } from '@models/asset_tag';
import { AssetTexture } from '@models/asset_texture';
import { FileExtensionType } from '@models/file_extension_type';
import { Job } from '@models/jobs/job';
import { Product } from '@models/product';
import { ProductCombination } from '@models/product_combination';
import { Tag } from '@models/tag';

// Joins
Asset.hasMany(AssetAbAlternative, {
  as: 'abAlteratives',
  foreignKey: 'assetId',
  sourceKey: 'id',
});

Asset.hasOne(AssetComplexityType, {
  as: 'complexity',
  foreignKey: 'id',
  sourceKey: 'complexityId',
});

Asset.hasMany(AssetFile, {
  as: 'files',
  foreignKey: 'assetId',
  sourceKey: 'id',
});

Asset.hasMany(AssetRender, {
  as: 'renders',
  foreignKey: 'assetId',
  sourceKey: 'id',
});

Asset.hasMany(AssetSpinSet, {
  as: 'spinSets',
  foreignKey: 'assetId',
  sourceKey: 'id',
});

Asset.hasMany(AssetSubmission, {
  as: 'submissions',
  foreignKey: 'assetId',
  sourceKey: 'id',
});

Asset.hasMany(AssetTexture, {
  as: 'textures',
  foreignKey: 'assetId',
  sourceKey: 'id',
});

Asset.hasOne(Product, {
  as: 'product',
  foreignKey: 'assetId',
  sourceKey: 'id',
});
Asset.belongsToMany(Tag, { through: AssetTag });

// Scopes with includes
Asset.addScope('details', {
  attributes: ['allowDownload', 'cameraOrbit', 'cameraTarget', 'hdr', 'name', 'published', 'uid'],
  include: [
    {
      as: 'files',
      model: AssetFile.scope('nameSizeType'),
    },
    {
      as: 'product',
      attributes: ['uid'],
      include: [
        {
          as: 'job',
          attributes: ['uid'],
          model: Job,
        },
      ],
      model: Product,
    },
    {
      as: 'renders',
      attributes: ['filename'],
      model: AssetRender,
    },
    {
      as: 'spinSets',
      model: AssetSpinSet,
    },
  ],
  order: [[Sequelize.col('files.updated_at'), 'DESC']],
});
Asset.addScope('combinations', (uid: string) => ({
  attributes: ['uid'],
  include: [
    {
      as: 'product',
      attributes: ['uid'],
      include: [
        {
          as: 'combinations',
          include: [
            {
              as: 'asset',
              attributes: ['name', 'uid'],
              include: [
                {
                  as: 'textures',
                  include: [
                    {
                      as: 'extension',
                      model: FileExtensionType,
                    },
                  ],
                  model: AssetTexture,
                },
              ],
              model: Asset,
            },
          ],
          model: ProductCombination,
        },
      ],
      model: Product,
    },
  ],
  where: { uid: uid },
}));
Asset.addScope('qaDetails', {
  attributes: ['allowDownload', 'cameraOrbit', 'cameraTarget', 'hdr', 'name', 'uid'],
  include: [
    {
      as: 'submissions',
      include: [
        {
          as: 'status',
          model: AssetSubmissionStatusType,
        },
      ],
      model: AssetSubmission.scope('basic'),
    },
  ],
});
Asset.addScope('submissions', {
  include: [
    {
      as: 'submissions',
      include: [
        {
          as: 'status',
          model: AssetSubmissionStatusType,
        },
      ],
      model: AssetSubmission.scope('basic'),
    },
  ],
});
Asset.addScope('viewer', {
  include: [
    {
      as: 'abAlteratives',
      model: AssetAbAlternative,
      required: false,
    },
  ],
});

Asset.adminInsert = (name: string) => {
  return new Promise((resolve, reject) => {
    Asset.count({ where: { name: name } })
      .then(has_duplicate => {
        if (has_duplicate) {
          // If there is a duplicate already, return that id
          Asset.findOne({
            where: { name: name },
          })
            .then(duplicate => {
              if (duplicate) {
                resolve({ created: false, id: duplicate.id });
              }
            })
            .catch((err: Error) => {
              Log.error('An asset with name ' + name + ' already exists');
              reject('The name ' + name + ' is already in use');
            });
        } else {
          return Helpers.getNewUidForModel(Asset, 12)
            .then(uid => {
              Asset.create({
                uid: uid,
                name: name,
                complexityId: AssetComplexityTypeEnum.MEDIUM,
              })
                .then(result => {
                  // Tag with all(id:1) and February2020 (id: 55)
                  // Temp: hard code the sql command
                  // TODO: revamp the tagging system - this hard coding to a month is terrible, but I don't have time to rewrite it now
                  sql
                    .query(
                      'INSERT INTO asset_tags (asset_id,tag_id,sort_weight,created_at,updated_at) values (:id, 1, :sort_weight, NOW(), NOW()), (:id, 55, :sort_weight, NOW(), NOW())',
                      { replacements: { id: result.id, sort_weight: result.id } },
                    )
                    .then(([results, metadata]) => {
                      Log.debug('Asset tagged with all and February2020');
                    })
                    .catch((err: Error) => {
                      Log.error('Unable to insert tag');
                    });
                  //AssetTag
                  resolve({ created: true, id: result.id });
                })
                .catch(err => {
                  reject(err);
                });
            })
            .catch((err: Error) => {
              Log.error('Unable to get uid for asset');
              Log.error(err);
              reject(err);
            });
        }
      })
      .catch((err: Error) => {
        Log.error('unable to check for duplicate asset');
        reject();
      });
  });
};

Asset.createForProduct = (productId: number) => {
  // Load product info
  return new Promise((resolve, reject) => {
    let product: any;
    Product.findByPk(productId)
      .then((productResult: any) => {
        product = productResult;
        return Helpers.getNewUidForModel(Asset, 12);
      })
      .then((uid: string) => {
        return Asset.create({
          uid: uid,
          name: product.blendName,
          complexityId: AssetComplexityTypeEnum.MEDIUM,
          productName: product.name,
          productUrl: product.url, // used for Quick Look Action Link
        });
      })
      .then((asset: any) => {
        resolve(asset);
      })
      .catch((err: Error) => {
        Errors.reject(reject, err, 'Unable to create asset for product ' + productId);
      });
  });
};

Asset.findAllWithoutProducts = () => {
  return new Promise((resolve, reject) => {
    Asset.findAll({
      include: [
        {
          attributes: [], // no attributes needed for NOT IN
          as: 'product',
          model: Product,
          required: false, // do not generate INNER JOIN
        },
      ],
      order: [['name', 'ASC']],
      where: Sequelize.where(Sequelize.col('product.id'), 'IS', null),
    })
      .then(results => {
        if (results) {
          Log.debug('Results Found');
          resolve({ assets: results });
        } else {
          Log.debug('No Results Found');
          resolve({ assets: [] });
        }
      })
      .catch((err: Error) => {
        Log.error('Error getting assets without products');
        Log.error(err);
        reject();
      });
  });
};
