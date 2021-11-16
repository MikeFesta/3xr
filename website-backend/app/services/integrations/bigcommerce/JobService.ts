// SPDX-License-Identifier: Apache-2.0
import { JobAttributes } from '@types';
import { BCJob } from './Models';
import { xrProductBCProductModel } from './ProductService';

/**
 * 3XR product model to the BigCommerce product model.
 *
 * @param xrProduct Product model
 */
export const xrJobToBCProductModel = (xrJob: JobAttributes): BCJob => ({
  id: xrJob.id,
  dateDue: xrJob.dateDue,
  uid: xrJob.uid,
  statusId: xrJob.statusId,
  product: xrJob.product ? xrProductBCProductModel(xrJob.product) : xrJob.product,
});
