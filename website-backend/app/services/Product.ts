// SPDX-License-Identifier: Apache-2.0
import { Job } from '@models/jobs/job';
import { JobStatusTypeEnum } from '@enums';
import { Product } from '@models/product';

/**
 * Updates Product artistUserID with given artistId, and updates Job status
 *
 * @param {string} productUid
 * @param {number} artistId
 */
export async function assignArtist(productUid: string, artistId: number) {
  // update Product
  const product = await Product.findOne({ where: { uid: productUid } });
  if (!product) {
    throw new Error(`Error finding product ${productUid}`);
  }

  product.artistUserId = artistId;
  await product.save();

  // update Job
  const job = await Job.findOne({ where: { productId: product.id } });

  if (!job) {
    throw new Error(`Error finding job for a product with UID: ${productUid}`);
  }

  if (job.statusId === JobStatusTypeEnum.UNASSIGNED) {
    await job.setStatus(JobStatusTypeEnum.ASSIGNED);
  }
}

export async function assignProducts(productUids: string[], artistId: number) {
  for (const uid of productUids) {
    await assignArtist(uid, artistId);
  }
}
