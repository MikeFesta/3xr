// SPDX-License-Identifier: Apache-2.0
import { Product, ProductInstance } from '@models/product';
import { ProductHolding } from '@models/product_holding';
import { Job } from '@models/jobs/job';
import { UserClient } from '@models/user_client';
import { BCJob, BCProductI } from './Models';
import {
  importProductReferenceImageAPIToHolding,
  importProductReferenceImageFromHolding,
} from './ProductReferenceImageUseCases';
import {
  bcProductToProductHoldingCreateModel,
  productHoldingToXRProductCreateModel,
  xrProductHoldingToBCProduct,
} from './ProductService';
import { xrJobToBCProductModel } from './JobService';

import Log from '@root/log';

/**
 * Import BigCommerce products into product holding.
 *
 * @param userId User id
 * @param bcProducts Big commerce products
 * @param projectHoldingId Project holding in
 */
export const createProductHolding = async (
  userId: number,
  bcProducts: BCProductI[],
  projectHoldingId?: number,
): Promise<void> => {
  try {
    const userClients = await UserClient.getUserClientIds(userId);
    const clientId = userClients[0];
    if (clientId) {
      // Create upsert product holding for the BigCommerce product being imported
      await Promise.all(
        bcProducts.map(async bcProductData => {
          const existingProductHolding = await ProductHolding.findOne({
            where: {
              bcProductId: bcProductData.id,
              deleted: false,
            },
          });
          // If old product import exists then delete it and
          if (existingProductHolding) {
            await existingProductHolding.destroy();
          }
          try {
            const productHoldingInstance = await ProductHolding.create(
              bcProductToProductHoldingCreateModel(clientId, bcProductData, projectHoldingId),
            );
            await importProductReferenceImageAPIToHolding(productHoldingInstance.id, bcProductData.referenceImages);
          } catch (error) {
            Log.error(error);
          }
        }),
      ).catch(err => {
        Log.error(err.message);
      });
      Log.debug(`Imported ${bcProducts.length} Big Commerce product data into 3XR product holding.`);
      return;
    }
    throw new Error(`No client id available for product create.`);
  } catch (err) {
    throw new Error(`Error importing BigCommerce products for user ${userId} into product holding, ${err}.`);
  }
};

/**
 * Import product holding as new product.
 *
 * @param xrProductId Product id
 */
export const importProductFromHolding =
  async (productHoldingId: number): Promise<ProductInstance> => {
    try {
      const productHoldingInstance = await ProductHolding.findOne({ where: { id: productHoldingId, deleted: false } });
      if (!productHoldingInstance) {
        throw new Error(`Error no product holding record found for product holding id ${productHoldingId}.`);
      }
      const productCreationAttributes = productHoldingToXRProductCreateModel(productHoldingInstance);
      const productInstance = await Product.imporProductFromProductCreationAttributes(productCreationAttributes);
      importProductReferenceImageFromHolding(productInstance.id, productHoldingInstance.id);
      ProductHolding.update({ deleted: true }, { where: { id: productHoldingInstance.id } });
      Log.info(`Imported product holding as new product.`);
      return productInstance;
    } catch (err) {
      Log.error(`Error importing product holding as new product ${err}.`);
      throw err;
    }
  };

/**
 * Get product and jobs states.
 *
 * @param userId Product id
 */
export const getProductAndJobStates =
  async (userId: number): Promise<{ productsHoldings: BCProductI[]; jobProducts: BCJob[] }> => {
    const userClients = await UserClient.getUserClientIds(userId);
    // Get internal models
    const productsHoldings = await ProductHolding.findAll({ where: { clientId: userClients } });
    const jobProducts = await Job.findBigCommerceJobsByClientIds(userClients);
    // Normalize to external models for BigCommerce application
    const productsHoldingsNormalized = productsHoldings.map(xrProductHoldingToBCProduct);
    const jobProductsNormalized = jobProducts.map(xrJobToBCProductModel);
    return {
      productsHoldings: productsHoldingsNormalized,
      jobProducts: jobProductsNormalized,
    };
  };
