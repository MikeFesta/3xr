// SPDX-License-Identifier: Apache-2.0
import { basename } from 'path';
import { BCProductReferenceImageI } from './Models';
import {
  ProductReferenceImageCreationAttributes,
  ProductHoldingReferenceImageAttributes,
  ProductHoldingReferenceImageCreationAttributes,
} from '@types';

// --- Private

/**
 * Remove query string from the path.
 *
 * @param url Filepath
 */
const removeQueryString = (url: string): string => {
  return url.split('?')[0];
};

/**
 * Extract filename from path.
 *
 * @param path BigCommerce filepath
 */
const extractFilenameFromPath = (path: string): string => {
  return basename(removeQueryString(path));
};

/**
 * Is product reference image the primary.
 * Zero index sort order
 *
 * @param path BigCommerce filepath
 */
const isBCPrimaryReferenceImage = (bcProductImageModel: BCProductReferenceImageI): boolean => {
  return bcProductImageModel.sortOrder === 1;
};

// -- Public methods

/**
 * Curried: Translate BigCommerce reference image to product holding create schema.
 *
 * @param productHoldingId 3XR Product import Id
 */
export const bcProductReferenceImageToProductHoldingCreateSchema = (productHoldingId: number) => {
  return (bcProductImageModel: BCProductReferenceImageI): ProductHoldingReferenceImageCreationAttributes => {
    return {
      bcProductId: bcProductImageModel.productId,
      bcProductReferenceImageId: bcProductImageModel.id,
      filename: extractFilenameFromPath(bcProductImageModel.imageFile),
      primary: isBCPrimaryReferenceImage(bcProductImageModel),
      imageSmallUrl: removeQueryString(bcProductImageModel.thumbnailUrl),
      imageLargeUrl: removeQueryString(bcProductImageModel.standardUrl),
      productHoldingId: productHoldingId,
      sortWeight: bcProductImageModel.sortOrder,
    };
  };
};

/**
 * Curried: Translate 3XR Product reference image holding to product create schema.
 *
 * @param productHoldingId 3XR Product import Id
 */
export const bcProductReferenceImageHoldingToProductCreateSchema = (productId: number) => {
  return (
    productHoldingReferenceImageAttributes: ProductHoldingReferenceImageAttributes,
  ): ProductReferenceImageCreationAttributes => {
    return {
      filename: productHoldingReferenceImageAttributes.filename,
      primary: productHoldingReferenceImageAttributes.primary,
      productId: productId,
      sortWeight: productHoldingReferenceImageAttributes.sortWeight,
    };
  };
};
