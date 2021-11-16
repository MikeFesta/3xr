// SPDX-License-Identifier: Apache-2.0
import * as Joi from 'joi';

// --- Custom field schema

export const XR_CUSTOM_FIELD_ASSET_ID = 'XR_ASSET_ID';

// --- Jobs

export interface BCJob {
  id: number;
  dateDue: string;
  product?: BCProductI;
  statusId: number;
  uid: string;
}

/**
 * BigCommerce custom field model.
 *
 * Ex:
 * This is what a raw custom attribute model from the BigCommerce API V3 looks like (10.30.2020)
 * {
 *  "id": 1,
 *  "product_id": 111,
 *  "name": "asset_id",
 *  "text": "y0e3dq6jmg9n"
 * }
 */
export interface BCProductCustomField {
  id: number; // Id of the custom field on BigCommerce
  productId: number;
  name: string;
  text: string;
}

export const bcProductCustomFieldXrAssetIdSchema = Joi.object({
  id: Joi.number().required(),
  productId: Joi.number(),
  name: Joi.string().valid(XR_CUSTOM_FIELD_ASSET_ID).required(),
  text: Joi.string().required(),
});

// --- Reference image

/**
 * Translate BigCommerce reference image to internal model.
 *
 * Ex:
 * This is what a raw custom attribute model from the BigCommerce API V3 looks like (10.30.2020)
 * {
 *  "id": 373,
 *  "product_id": 111,
 *  "image_file": "../app/assets/img/sample_images/stencil/smithjournal4.jpg",
 *  "zoom_url": "https://cdn11.bigcommerce.com/s-9rjtpghnst/products/111/images/373/smithjournal4.1603726917.1280.1280.jpg?c=1",
 *  "thumbnail_url": "https://cdn11.bigcommerce.com/s-9rjtpghnst/products/111/images/373/smithjournal4.1603726917.386.513.jpg?c=1",
 *  "standard_url": "https://cdn11.bigcommerce.com/s-9rjtpghnst/products/111/images/373/smithjournal4.1603726917.220.290.jpg?c=1",
 *  "tiny_url": "https://cdn11.bigcommerce.com/s-9rjtpghnst/products/111/images/373/smithjournal4.1603726917.44.58.jpg?c=1",
 *  "is_thumbnail": false,
 *  "sort_order": 2,
 *  "description": "",
 *  "date_created": "Fri, 03 Jul 2015 20:55:11 +0000",
 *  "date_modified": "Mon, 26 Oct 2020 15:41:57 +0000",
 *  "is_sample": true
 * }
 */
export interface BCProductReferenceImageI {
  id: number; // BigCommerce Id
  productId: number;
  imageFile: string;
  thumbnailUrl: string;
  standardUrl: string;
  sortOrder: number;
}

export const bcProductReferenceImageSchema = Joi.object({
  id: Joi.number().required(),
  imageFile: Joi.string().required(),
  productId: Joi.number().required(),
  thumbnailUrl: Joi.string().required(),
  standardUrl: Joi.string().required(),
  sortOrder: Joi.number().required(),
});

// --- Product schema

export interface BCProductI {
  id: number;
  name: string;
  sku: string;
  description: string;
  width: number;
  height: number;
  depth: number;
  upc: string;
  referenceImages: BCProductReferenceImageI[];
  customFields: BCProductCustomField[];
}

export interface BCProjectHoldingCreateI {
  name: string;
  productHoldings: BCProductI[];
}

const bcProductSchema = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().required(),
  sku: Joi.string().allow('').required(),
  description: Joi.string().allow('').required(),
  width: Joi.number().required(),
  height: Joi.number().required(),
  depth: Joi.number().required(),
  upc: Joi.string().allow('').required(),
  referenceImages: Joi.array().items(bcProductReferenceImageSchema).required(),
});

export const bcBCProductArraySchema = Joi.array().items(bcProductSchema);

export const bcProjectHoldingCreateSchema = Joi.object({
  name: Joi.string().required(),
  productHoldings: bcBCProductArraySchema,
});
