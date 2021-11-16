// SPDX-License-Identifier: Apache-2.0
import Sequelize, { BuildOptions, Op, Model } from 'sequelize';
import { ProductAttributes, ProductCreationAttributes, ProductCreationAttributesWithoutComputedFields } from '@types';
import { AssignmentModelingTypeEnum, UnitTypeEnum } from '@enums';
import { AssignmentModelingType } from '@models/assignment_modeling_type';
import { UnitType } from '@models/unit_type';
import Helpers from '@root/helpers';
import { sql } from '@root/sql';

import Errors from '@root/errors';

export interface ProductInstance extends Model<ProductAttributes, ProductCreationAttributes>, ProductAttributes {
  initAndZip(): Promise<void>;
}

type ProductModelStatic = typeof Model & {
  new(values?: object, options?: BuildOptions): ProductInstance;
  createForProject(
    depth: number,
    height: number,
    name: string,
    partNumber: string,
    unitTypeId: UnitTypeEnum,
    url: string,
    width: number,
  ): Promise<number>;
  imporProductFromProductCreationAttributes(
    productCreationAttributes: ProductCreationAttributesWithoutComputedFields,
  ): Promise<ProductInstance>;
  readyToSubmit(uid: string, apiToken: string): Promise<{ ready: Boolean; message: string; submissionId?: number }>;
  getDataForBlenderPlugin(uid: string, api_token: string): Promise<any>;
  search(query: string, userId: number): Promise<ProductInstance[]>;
  validateArtistByApiToken(uid: string, api_token: string): Promise<ProductInstance | null>;
  setAssetId(productUid: string, assetId: string): Promise<void>;
};

export const Product = sql.define(
  'product',
  {
    assetId: {
      // This will eventually become a 1:Many relationship
      type: Sequelize.INTEGER,
    },
    artistUserId: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
    },
    asin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    blendName: {
      type: Sequelize.STRING,
      allowNull: true,
      get: function (this: any) {
        if (!this.getDataValue('blendName')) {
          return '';
        } else {
          return this.getDataValue('blendName').toLowerCase();
        }
      },
    },
    bcProductId: {
      type: Sequelize.INTEGER,
      allowNull: true,
    },
    depth: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    height: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    modelingTypeId: {
      type: Sequelize.INTEGER,
      defaultValue: AssignmentModelingTypeEnum.FROM_SCRATCH,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    partNumber: {
      type: Sequelize.STRING,
    },
    uid: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    unitTypeId: {
      type: Sequelize.INTEGER,
      defaultValue: UnitTypeEnum.METERS,
    },
    url: {
      type: Sequelize.STRING,
    },
    width: {
      type: Sequelize.FLOAT,
      defaultValue: 0,
    },
    deleted: {
      allowNull: false,
      defaultValue: false,
      type: Sequelize.BOOLEAN,
    },
  },
  {
    tableName: 'products',
    defaultScope: {
      where: {
        deleted: false,
      },
    },
    scopes: {
      minimum: {
        attributes: ['id', 'name', 'uid'],
      },
      forNotifications: {
        attributes: ['id', 'name', 'uid'],
      },
    },
    getterMethods: {
      heightInches: function (this: any) {
        if (this.getDataValue('unitTypeId') == UnitTypeEnum.METERS) {
          return this.getDataValue('height') / 0.0254;
        } else {
          return this.getDataValue('height');
        }
      },
      heightMeters: function (this: any) {
        if (this.getDataValue('unitTypeId') == UnitTypeEnum.METERS) {
          return this.getDataValue('height');
        } else {
          return this.getDataValue('height') * 0.0254;
        }
      },
      widthInches: function (this: any) {
        if (this.getDataValue('unitTypeId') == UnitTypeEnum.METERS) {
          return this.getDataValue('width') / 0.0254;
        } else {
          return this.getDataValue('width');
        }
      },
      widthMeters: function (this: any) {
        if (this.getDataValue('unitTypeId') == UnitTypeEnum.METERS) {
          return this.getDataValue('width');
        } else {
          return this.getDataValue('width') * 0.0254;
        }
      },
      depthInches: function (this: any) {
        if (this.getDataValue('unitTypeId') == UnitTypeEnum.METERS) {
          return this.getDataValue('depth') / 0.0254;
        } else {
          return this.getDataValue('depth');
        }
      },
      depthMeters: function (this: any) {
        if (this.getDataValue('unitTypeId') == UnitTypeEnum.METERS) {
          return this.getDataValue('depth');
        } else {
          return this.getDataValue('depth') * 0.0254;
        }
      },
    },
  },
) as ProductModelStatic;

export default Product;

// Additional Includes
import { Asset } from '@models/asset';
import { AssetSubmission } from '@models/asset_submission';
import { AssetSubmissionIssue } from '@models/asset_submission_issue';
import { AssetSubmissionStatusType } from '@models/asset_submission_status_type';
import { Job } from '@models/jobs/job';
import { JobStatusType } from '@models/job_status_type';
import { Material } from '@models/material';
import { Part } from '@models/part';
import { ProductPart } from '@models/product_part';
import { ProductAdditionalFile } from '@models/product_additional_file';
import { ProductCombination } from '@models/product_combination';
import { ProductFavorite } from '@models/product_favorite';
import { ProductMaterial } from '@models/product_material';
import { ProductReferenceImage } from '@models/product_reference_image';
import { Project } from '@models/project';
import { RabbitMessage } from '@models/rabbit_message';
import { User } from '@models/user';

// Joins
Product.hasOne(User, {
  as: 'artist',
  foreignKey: 'id',
  sourceKey: 'artistUserId',
});

Product.hasOne(Asset, {
  as: 'asset',
  foreignKey: 'id',
  sourceKey: 'assetId',
});

Product.hasOne(Job, {
  as: 'job',
  foreignKey: 'productId',
  sourceKey: 'id',
});

Product.belongsToMany(User, { as: 'favorites', through: ProductFavorite });
Product.belongsToMany(Material, { through: ProductMaterial });
Product.belongsToMany(Part, { through: ProductPart });

Product.hasOne(AssignmentModelingType, {
  as: 'modeling_type',
  foreignKey: 'id',
  sourceKey: 'modelingTypeId',
});

Product.hasMany(ProductAdditionalFile, {
  as: 'additionalFiles',
  foreignKey: 'productId',
  sourceKey: 'id',
});

Product.hasMany(ProductCombination, {
  as: 'combinations',
  foreignKey: 'productId',
  sourceKey: 'id',
});

Product.hasMany(ProductReferenceImage, {
  as: 'referenceImages',
  foreignKey: 'productId',
  sourceKey: 'id',
});

Product.hasOne(UnitType, {
  as: 'units',
  foreignKey: 'id',
  sourceKey: 'unitTypeId',
});

// Scopes with includes
Product.addScope('adminDashboard', {
  attributes: ['name', 'uid'],
  include: [
    {
      as: 'asset',
      model: Asset,
    },
    {
      as: 'referenceImages',
      model: ProductReferenceImage.scope('adminDashboard'),
      required: false,
    },
  ],
});

Product.addScope('isUserFavorite', (userId: number) => ({
  include: [
    {
      attributes: ['id'],
      as: 'favorites',
      model: User,
      required: false,
      where: {
        id: userId,
      },
    },
  ],
}));

Product.addScope('card', (userId: number) => ({
  attributes: ['id', 'name', 'uid'],
  include: [
    {
      as: 'asset',
      attributes: ['id', 'published', 'uid'],
      include: [
        {
          as: 'submissions',
          model: AssetSubmission,
        },
      ],
      model: Asset,
      required: false,
    },
    {
      as: 'artist',
      model: User.scope('basic'),
      required: false,
    },
    {
      attributes: ['id'],
      as: 'favorites',
      model: User,
      required: false,
      where: {
        id: userId,
      },
    },
    {
      as: 'job',
      attributes: ['id', 'uid', 'statusId'],
      include: [
        {
          as: 'project',
          attributes: ['id', 'uid'],
          model: Project,
        },
      ],
      model: Job,
      required: false,
    },
    {
      as: 'referenceImages',
      attributes: ['filename', 'id', 'primary', 'sortWeight'],
      model: ProductReferenceImage,
      where: { sortWeight: 1 },
    },
  ],
}));

Product.addScope('completedAssetsOnProject', (projectId: number) => ({
  attributes: ['name'],
  include: [
    {
      attributes: [],
      as: 'job',
      include: [
        {
          attributes: [],
          as: 'project',
          model: Project,
          where: { id: projectId },
        },
      ],
      model: Job,
      required: true,
    },
    {
      attributes: ['name', 'uid'],
      as: 'asset',
      model: Asset,
      where: { published: true },
    },
  ],
}));

Product.addScope('details', {
  attributes: [
    'artistUserId',
    'asin',
    'blendName',
    'depth',
    'height',
    'id',
    'name',
    'modelingTypeId',
    'partNumber',
    'uid',
    'unitTypeId',
    'url',
    'width',
  ],
  include: [
    {
      as: 'artist',
      attributes: ['firstName', 'id', 'lastName', 'username'],
      model: User,
    },
    {
      as: 'asset',
      model: Asset.scope('basic'),
      // Fetch asset details in a separate request
    },
    {
      as: 'additionalFiles',
      attributes: ['id', 'filename'],
      model: ProductAdditionalFile,
    },
    {
      as: 'referenceImages',
      attributes: ['filename', 'id', 'primary', 'sortWeight', 'fallbackImageUrl'],
      model: ProductReferenceImage,
    },
    {
      as: 'job',
      attributes: [
        'additionalDimensions',
        'createdAt',
        'dateDue',
        'id',
        'materialInformation',
        'modelingInstructions',
        'notes',
        'uid',
        'clientId',
      ],
      include: [
        {
          as: 'status',
          model: JobStatusType.scope('basic'),
        },
      ],
      model: Job,
    },
    {
      as: 'materials',
      model: Material,
      through: {
        attributes: ['slotName'],
      },
    },
    {
      as: 'parts',
      model: Part.scope('withSlots'),
      through: {
        attributes: [],
      },
    },
    {
      as: 'units',
      attributes: ['id', 'name'],
      model: UnitType,
    },
  ],
  order: [[Sequelize.col('referenceImages.sort_weight'), 'ASC']],
});

Product.addScope('favoritesForUser', (userId: number) => ({
  attributes: ['name'],
  include: [
    {
      attributes: [],
      as: 'favorites',
      model: User,
      required: true,
      where: { id: userId },
    },
    {
      attributes: ['name', 'uid'],
      as: 'asset',
      model: Asset,
    },
  ],
}));

Product.addScope('forArtist', (artistId: number[]) => ({
  where: { artistUserId: artistId },
}));

Product.addScope('forClients', (clientIds: number[]) => ({
  include: [
    {
      as: 'job',
      model: Job,
      required: true,
      where: { clientId: { [Op.in]: clientIds }, deleted: false },
    },
  ],
}));

Product.addScope('forProject', (projectId: number) => ({
  include: [
    {
      as: 'job',
      attributes: ['materialInformation', 'modelingInstructions'],
      model: Job,
      where: { projectId: projectId },
    },
    {
      as: 'units',
      model: UnitType,
    },
  ],
}));

Product.addScope('forStudios', (studioIds: number[]) => ({
  include: [
    {
      as: 'job',
      model: Job,
      required: true,
      where: { studioId: { [Op.in]: studioIds }, deleted: false },
    },
  ],
}));

Product.addScope('search', (searchString: string) => ({
  where: {
    [Sequelize.Op.or]: [
      { asin: { [Sequelize.Op.iLike]: '%' + searchString + '%' } },
      { blendName: { [Sequelize.Op.iLike]: '%' + searchString + '%' } },
      { name: { [Sequelize.Op.iLike]: '%' + searchString + '%' } },
      { partNumber: { [Sequelize.Op.iLike]: '%' + searchString + '%' } },
    ],
  },
}));

Product.addScope('submittedAssetsOnProject', (projectId: number) => ({
  attributes: ['name'],
  include: [
    {
      attributes: [],
      as: 'job',
      include: [
        {
          attributes: [],
          as: 'project',
          model: Project,
          where: { id: projectId },
        },
      ],
      model: Job,
      required: true,
    },
    {
      attributes: ['name', 'uid'],
      as: 'asset',
      model: Asset,
      required: true,
    },
  ],
}));

Product.addScope('withUnits', {
  include: [
    {
      as: 'units',
      model: UnitType,
    },
  ],
});

Product.createForProject = (
  depth: number,
  height: number,
  name: string,
  partNumber: string,
  unitTypeId: UnitTypeEnum,
  url: string,
  width: number,
) => {
  return new Promise((resolve, reject) => {
    Helpers.getNewUidForModel(Product, 12)
      .then(productUid => {
        Product.create({
          // Limit to 40 characters because Blender does not like long names
          blendName: Helpers.convertToAlphaSnakeCase(name).substring(0, 40),
          depth: depth,
          height: height,
          name: name,
          partNumber: partNumber,
          uid: productUid,
          unitTypeId: unitTypeId,
          url: url,
          width: width,
        })
          .then(product => {
            resolve(product.id);
          })
          .catch((err: Error) => {
            Errors.reject(reject, err, 'unable to add product to project');
          });
      })
      .catch((err: Error) => {
        Errors.reject(reject, err, 'unable to get uid for product');
      });
  });
};

Product.imporProductFromProductCreationAttributes = async (
  productCreationAttributes: ProductCreationAttributesWithoutComputedFields,
): Promise<ProductInstance> => {
  try {
    const nextProductUid = await Helpers.getNewUidForModel(Product, 12);
    try {
      return Product.create({
        bcProductId: productCreationAttributes.bcProductId,
        blendName: Helpers.convertToAlphaSnakeCase(productCreationAttributes.name).substring(0, 40),
        depth: productCreationAttributes.depth,
        height: productCreationAttributes.height,
        name: productCreationAttributes.name,
        partNumber: productCreationAttributes.partNumber,
        uid: nextProductUid,
        unitTypeId: productCreationAttributes.unitTypeId,
        url: productCreationAttributes.url,
        width: productCreationAttributes.width,
      });
    } catch (err) {
      throw new Error(`Error unable to add product to project  ${err}.`);
    }
  } catch (err) {
    throw new Error(`Error unable to get uid for product ${err}.`);
  }
};

// Used by Blender to check if it can be (re)submitted
Product.readyToSubmit = (uid: string, apiToken: string) => {
  return new Promise((resolve, reject) => {
    return Product.findOne({
      attributes: ['uid'],
      include: [
        {
          as: 'artist',
          model: User,
          where: { apiToken: apiToken },
        },
        {
          as: 'asset',
          include: [
            {
              as: 'submissions',
              include: [
                { as: 'status', model: AssetSubmissionStatusType },
                {
                  as: 'openIssues',
                  model: AssetSubmissionIssue,
                  required: false,
                  where: { resolved: false },
                },
              ],
              model: AssetSubmission,
            },
          ],
          model: Asset,
        },
      ],
      where: {
        uid: uid,
      },
      order: [[Sequelize.col('asset->submissions.id'), 'DESC']],
    })
      .then(product => {
        if (!product) {
          // API Token or product uid invalid
          resolve({ ready: false, message: 'API Token or Product UID invalid' });
        } else if (!product.asset) {
          // No Asset
          resolve({ ready: true, message: 'no asset' });
          // @ts-ignore
        } else if (product.asset.submissions.length == 0) {
          // No prior submissions
          resolve({ ready: true, message: 'no submissions' });
          // @ts-ignore
        } else if (product.asset.submissions[0].status.resubmissionAllowed) {
          // @ts-ignore
          if (product.asset.submissions[0].openIssues.length == 0) {
            resolve({
              ready: true,
              message: 'last submission clear for resubmission',
              // @ts-ignore
              submissionId: product.asset.submissions[0].id,
            });
          } else {
            resolve({
              ready: false,
              message:
                'All open issues (' +
                // @ts-ignore
                product.asset.submissions[0].openIssues.length +
                ' remaining) must be marked as resolved before resubmission',
              // @ts-ignore
              submissionId: product.asset.submissions[0].id,
            });
          }
        } else {
          resolve({
            ready: false,
            // @ts-ignore
            message: 'Unable to Submit. Check 3xr.com. status: ' + product.asset.submissions[0].status.name,
            // @ts-ignore
            submissionId: product.asset.submissions[0].id,
          });
        }
      })
      .catch((err: Error) => {
        Errors.reject(reject, err, 'Unable to find submissions for product');
      });
  });
};

Product.getDataForBlenderPlugin = (uid: string, api_token: string) => {
  return Product.findOne({
    include: [
      {
        attributes: [],
        as: 'artist',
        model: User,
        where: { api_token: api_token },
      },
    ],

    where: { uid: uid },
  });
};

Product.validateArtistByApiToken = (uid: string, api_token: string) => {
  return Product.findOne({
    attributes: ['uid'],
    include: [
      {
        attributes: [],
        as: 'artist',
        model: User,
        where: { api_token: api_token },
      },
    ],
    where: { uid: uid },
  });
};

Product.setAssetId = (productUid: string, assetId: string) => {
  return new Promise((resolve, reject) => {
    Product.findOne({
      where: {
        uid: productUid,
      },
    })
      .then(result => {
        if (result) {
          // @ts-ignore
          result.assetId = assetId;
          result.save().then(result => {
            resolve();
          });
        } else {
          Errors.reject(reject, null, 'Error assigning asset. No result for product ' + productUid);
        }
      })
      .catch((err: Error) => {
        Errors.reject(reject, err, 'Error assigning asset (' + assetId + ') to product ' + productUid);
      });
  });
};

Product.prototype.initAndZip = async function () {
  // TODO: change the init_product rabbit action to use unit_id instead of name
  // Currently an error is thrown if this.units is undefined
  const data = {
    depth: this.depth,
    height: this.height,
    name: this.blendName,
    product_uid: this.uid,
    unit_type: this.units.name, // needs the scope withUnits
    width: this.width,
  };
  await RabbitMessage.sendNewMessageToQueueWithData(
    'init_product',
    data,
    0, // user id not needed. often comes from x.3xr.com
  );
};
