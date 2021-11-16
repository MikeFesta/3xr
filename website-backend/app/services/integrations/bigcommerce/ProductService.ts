// SPDX-License-Identifier: Apache-2.0
import { AssignmentModelingTypeEnum, UnitTypeEnum } from '@enums';
import {
  AssetAttributes,
  ProductAttributes,
  ProductHoldingAttributes,
  ProductHoldingCreationAttributes,
  ProductCreationAttributesWithoutComputedFields,
} from '@types';
import { BCProductI, XR_CUSTOM_FIELD_ASSET_ID } from './Models';

import { ProductHoldingTypeEnum } from '@root/interfaces/ProductHoldingTypeEnum';
import { ProductHoldingInstance } from '@root/models/product_holding';

// --- Types

type XRDimension = { unityType: UnitTypeEnum; units: number };

// --- Conversions

const BC_DEFAULT_UNITS = 0;
const centimetersToInches = (centimeters: number) => centimeters / 2.5;
const metersToInches = (meters: number) => meters * 39.37;

const xrDimensionToBCDimensionsMeasurement = (xrDimension: XRDimension): number => {
  switch (xrDimension.unityType) {
    case UnitTypeEnum.CENTIMETERS:
      return centimetersToInches(xrDimension.units);
    case UnitTypeEnum.METERS:
      return metersToInches(xrDimension.units);
    default:
      return xrDimension.units;
  }
};

/**
 * BigCommerce product Product Import.
 *
 * @param clientId Client id
 * @param bcProduct BigCommerce Product model
 */
export const bcProductToProductHoldingCreateModel = (
  clientId: number,
  bcProduct: BCProductI,
  projectHoldingId?: number,
): ProductHoldingCreationAttributes => {
  return {
    bcProductId: bcProduct.id,
    clientId: clientId,
    productHoldingType: ProductHoldingTypeEnum.BIG_COMMERCE,
    projectHoldingId: projectHoldingId,
    depth: bcProduct.depth,
    height: bcProduct.height,
    width: bcProduct.width,
    name: bcProduct.name,
    description: bcProduct.description,
    partNumber: bcProduct.upc,
    sku: bcProduct.sku,
    unitTypeId: UnitTypeEnum.INCHES,
    deleted: false,
  };
};

/**
 * Product holding model to 3xr Product Create model (Without computed initial attributes)
 *
 * @param bcProduct Product holding model
 */
export const productHoldingToXRProductCreateModel = (
  productHolding: ProductHoldingAttributes,
): ProductCreationAttributesWithoutComputedFields => {
  return {
    asin: undefined,
    bcProductId: productHolding.bcProductId,
    depth: productHolding.depth,
    height: productHolding.height,
    width: productHolding.width,
    modelingTypeId: AssignmentModelingTypeEnum.FROM_SCRATCH,
    name: productHolding.name,
    partNumber: productHolding.partNumber,
    unitTypeId: productHolding.unitTypeId,
    url: '',
  };
};

/**
 * Product holding model to BigCommerce model
 *
 * Because the holding table is getting re-used by various 3rd-party models
 * that will inevitabley have their own number id that may be a  uuid | guid | number | string
 * then we need to use to retain the our usual numeric id.
 *
 *
 * @param productHolding Product holding record tha.
 */
export const xrProductHoldingToBCProduct = (productHolding: ProductHoldingInstance): BCProductI => {
  return {
    // Out of bounds denotes bad record
    id: productHolding.bcProductId || -1,
    name: productHolding.name,
    sku: productHolding.sku || '',
    description: productHolding.description,
    width: productHolding.width,
    height: productHolding.height,
    depth: productHolding.depth,
    upc: productHolding.partNumber || '',
    referenceImages: [],
    customFields: [],
  };
};

/**
 * 3XR product model to the BigCommerce product model.
 *
 * @param xrProduct Product model
 */
export const xrProductBCProductModel = (xrProduct: ProductAttributes): BCProductI => {
  const getXRDimension = (units?: number) => {
    return units && xrProduct.unitTypeId
      ? xrDimensionToBCDimensionsMeasurement({ unityType: xrProduct.unitTypeId, units: units })
      : BC_DEFAULT_UNITS;
  };
  const assetToCustomField = (asset: AssetAttributes) => ({
    id: 0,
    productId: xrProduct.bcProductId || 0,
    name: XR_CUSTOM_FIELD_ASSET_ID,
    text: asset.uid,
  });
  const customFields = xrProduct.asset ? [assetToCustomField(xrProduct.asset)] : [];
  return {
    id: xrProduct.bcProductId || 0,
    depth: getXRDimension(xrProduct.depth),
    height: getXRDimension(xrProduct.height),
    width: getXRDimension(xrProduct.width),
    name: xrProduct.name,
    upc: xrProduct.partNumber || '',
    referenceImages: [],
    customFields: customFields,
    sku: '',
    description: '',
  };
};
