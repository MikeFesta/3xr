// SPDX-License-Identifier: Apache-2.0
import Axios from 'axios';
import FormData from 'form-data';
import Product from '@root/models/product';
import { ProductHoldingReferenceImage, ProductImportReferenceImageInstance } from '@models/product_holding_reference_image';
import { ProductReferenceImage } from '@root/models/product_reference_image';
import { BCProductReferenceImageI } from './Models';
import { bcProductReferenceImageToProductHoldingCreateSchema } from './ProductReferenceImageService';
import Helpers from '@root/helpers';

import Log from '@root/log';

export interface RemoteReferenceImageUpload {
  productUid: string;
  fileName: string;
  imageUrl: string;
  referenceImageId?: number;
}

/**
 * Add remote product reference image.
 *
 * @param imageUploadPayload Image upload payload
 */
const addRemoteProductReferenceImage = async (
  imageUploadPayload: RemoteReferenceImageUpload
): Promise<void> => {
  try {

    const uploadFormData = new FormData();
    const uploadFormOptions = {
      headers: {
        'Content-Disposition': 'form-data',
        'Content-Type': 'image/jpeg',
      },
      filename: imageUploadPayload.fileName,
      contentType: 'image/jpeg',
    };

    if (!Helpers.isProduction()) {
      if (process.env.SUBDOMAIN_NAME) {
        uploadFormData.append('dev', process.env.SUBDOMAIN_NAME);
      } else {
        throw new Error(`Missing environment variable, "SUBDOMAIN_NAME".`)
      }
    }

    if (imageUploadPayload.referenceImageId) {
      uploadFormData.append('referenceImageId', imageUploadPayload.referenceImageId);
    }

    uploadFormData.append('uid', imageUploadPayload.productUid);

    const readStreamOnImage = await Axios({
      url: imageUploadPayload.imageUrl,
      method: 'GET',
      responseType: 'stream',
    });

    uploadFormData.append('images', readStreamOnImage.data, uploadFormOptions);
    const referenceImageUploadUrl = 'https://x.3xr.com/upload/product_reference_images';
    const result = await Axios.post(referenceImageUploadUrl, uploadFormData, {
      headers: uploadFormData.getHeaders(),
    });
    Log.debug(`Recieved response ${result.data} from ${referenceImageUploadUrl}. Uploaded image for ${imageUploadPayload.productUid}`);
  } catch (err) {
    Log.error(`Failed to upload reference image to product (${imageUploadPayload.productUid}). Server responded with ${err}.`);
  }
};

/**
 * Bulk product reference image upload (Do not await).
 *
 * @param imageUploadPayloads Image upload payload
 */
export const bulkRemoteProductReferenceImage =
  async (imageUploadPayloads: RemoteReferenceImageUpload[]) => {
    for (let index = 0; index < imageUploadPayloads.length; index++) {
      // Do not delay the first image
      if (index !== 0) { await Helpers.waitMs(3000); }
      const referenceImageHoldingInstace = imageUploadPayloads[index];
      await addRemoteProductReferenceImage(referenceImageHoldingInstace);
    }
  }
// --- Importing

/**
 * Import BigCommerce product reference image to holding.
 * In the event that there is an existing product reference image then delete in and then create a new entry.
 *
 * @param productHoldingId Product holding id
 * @param bcProductReferenceImage Product reference images
 */
export const importProductReferenceImageAPIToHolding = async (
  productHoldingId: number,
  bcProductReferenceImages: BCProductReferenceImageI[],
): Promise<void> => {
  const referenceImagesCreateData = bcProductReferenceImages.map(
    bcProductReferenceImageToProductHoldingCreateSchema(productHoldingId),
  );
  // Create product holding reference image records
  await Promise.all(
    referenceImagesCreateData.map(async createData => {
      // Check if there is an existing record for this reference image
      const existingReferenceImage = await ProductHoldingReferenceImage.findOne({
        where: {
          bcProductId: createData.bcProductId,
          bcProductReferenceImageId: createData.bcProductReferenceImageId,
          deleted: false,
        },
      });
      if (existingReferenceImage) {
        await ProductHoldingReferenceImage.update(
          { deleted: true },
          {
            where: { id: existingReferenceImage.id },
          },
        );
      }
      await ProductHoldingReferenceImage.create(createData);
      return;
    }),
  );
  Log.info(`Imported ${bcProductReferenceImages.length} BigCommerce product reference images into holding.`);
};

/**
 * Import product holding reference images to 3XR.
 *
 * @param xrProductId 3XR product to assosciate images to
 * @param productHoldingId Product holding record to import
 */
export const importProductReferenceImageFromHolding = async (
  xrProductId: number,
  productHoldingId: number,
): Promise<void> => {
  try {
    const product = await Product.findOne({ where: { id: xrProductId } });
    if (product) {
      const productHoldingReferenceImages = await ProductHoldingReferenceImage.findAll({
        where: {
          deleted: false,
          productHoldingId: productHoldingId,
        },
      });
      const imageUploadPayloads: RemoteReferenceImageUpload[] =
        await Promise.all(productHoldingReferenceImages.map(async (image, index) => {
          const productReferenceImage = await ProductReferenceImage.create({
            productId: product.id,
            filename: null,
            sortWeight: index,
            primary: index === 0,
            fallbackImageUrl: image.imageLargeUrl
          })
          await ProductHoldingReferenceImage.update({ deleted: true }, { where: { id: image.id } });
          return {
            productUid: product.uid,
            imageUrl: image.imageLargeUrl,
            fileName: image.filename,
            referenceImageId: productReferenceImage.id
          }
        }))
      bulkRemoteProductReferenceImage(imageUploadPayloads);
    } else {
      throw new Error(`Unable to find product XR product with id ${xrProductId}.`);
    }
  } catch (err) {
    Log.error(`Error importing reference image to 3xr ${err}.`);
  }
};
