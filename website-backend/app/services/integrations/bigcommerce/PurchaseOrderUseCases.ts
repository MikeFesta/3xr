// SPDX-License-Identifier: Apache-2.0
import { UnitTypeEnum, ProjectStatusTypesEnum } from '@enums';
import Helpers from '@root/helpers';
import { Job } from '@models/jobs/job';
import { Project } from '@models/project';
import { ProductHolding } from '@models/product_holding';
import { UserClient } from '@models/user_client';
import { ProjectHolding, ProjectHoldingInstance } from '@models/project_holding';
import { BCProjectHoldingCreateI } from './Models';
import { createProductHolding, importProductFromHolding } from './ProductUseCases';

import Log from '@root/log';

export type ImportProjectFromHolding = {
  artistId: number;
  brandId: number;
  classId: number;
  clientId: number;
  dateDue: string;
  name: string;
  priorityId: number;
  qualityId: number;
  unitTypeId: number;
  projectHoldingId: number;
};

/**
 * Create project holding.
 *
 * @param userId User id
 * @param bcPurchaseOrder Project holding record
 */
export const createProjectHolding =
  async (
    userId: number,
    projectHoldingCreate: BCProjectHoldingCreateI,
  ): Promise<ProjectHoldingInstance> => {
    try {
      const userClients = await UserClient.getUserClientIds(userId);
      const clientId = userClients[0];
      if (clientId) {
        const projectHolding = await ProjectHolding.create({
          clientId,
          name: projectHoldingCreate.name,
          defaultUnitType: UnitTypeEnum.INCHES,
        });
        Log.debug(`Created purchase order with id ${projectHolding.id}.`);
        // Create holding entries for the products assosciated with the new purchase order
        await createProductHolding(userId, projectHoldingCreate.productHoldings, projectHolding.id);
        return projectHolding;
      }
      throw new Error(`No client id available for creating new purchase order.`);
    } catch (err) {
      throw new Error(`Error creating new purchase order, ${err}.`);
    }
  };

/**
 * Create 3X project from holding usecase.
 *
 * @param payload Payload
 */
export const importProjectFromHolding =
  async (payload: ImportProjectFromHolding): Promise<string> => {
    try {
      const uuid: string = await Helpers.getNewUidForModel(Project, 12);
      const projectInstance = await Project.create({
        clientId: payload.clientId,
        dateDue: payload.dateDue,
        defaultArtistId: 0,
        defaultBrand: payload.brandId,
        defaultClass: payload.classId,
        defaultPriority: payload.priorityId,
        defaultPrice: 0,
        defaultQuality: payload.qualityId,
        defaultUnitType: UnitTypeEnum.INCHES,
        name: payload.name,
        statusId: ProjectStatusTypesEnum.UNSUBMITTED,
        isCreatedFromHolding: true,
        uid: uuid,
        studioId: 1, // not using BC, so assigning to 3xr
      });
      // Products need to be created async in order to boost performance
      const productHoldingInstances = await ProductHolding.findAll({
        where: { projectHoldingId: payload.projectHoldingId },
      });
      const productInitResults = await Promise.all(productHoldingInstances.map(async (productHoldingInstance) => {
        const productInstance = await importProductFromHolding(productHoldingInstance.id);
        const jobUid = await Job.createForHoldingImport({
          brandId: payload.brandId,
          classId: payload.classId,
          clientId: payload.clientId,
          dateDue: payload.dateDue,
          priorityId: payload.priorityId,
          productId: productInstance.id,
          projectId: projectInstance.id,
          qualityId: payload.qualityId,
        });
        await ProjectHolding.update({ deleted: true }, { where: { id: payload.projectHoldingId } });
        Log.debug(`Created job uid: ${jobUid} from new project id:${projectInstance.id}`);
      }));
      Log.debug(`Created ${productInitResults.length} jobs for from new project id:${projectInstance.id}`);
      // For UX reasons waiting for the Job/Product before the redirect prevents a manual refresh
      return projectInstance.uid;
    } catch (err) {
      throw new Error(`Error creating new purchase order ${err}.`);
    }
  };
