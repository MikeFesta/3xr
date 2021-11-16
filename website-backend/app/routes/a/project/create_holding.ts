// SPDX-License-Identifier: Apache-2.0
import * as Joi from 'joi';
import express from 'express';
import ConnectEnsureLogin from 'connect-ensure-login';
import { studioCors } from '@cors/studio';
import Errors from '@root/errors';
import {
  importProjectFromHolding,
  ImportProjectFromHolding,
} from '@services/integrations/bigcommerce/PurchaseOrderUseCases';
const requestBodySchema = Joi.object({
  artistId: Joi.number().required(),
  brandId: Joi.number().required(),
  classId: Joi.number().required(),
  clientId: Joi.number().required(),
  dateDue: Joi.string().required(),
  name: Joi.string().required(),
  priorityId: Joi.number().required(),
  qualityId: Joi.number().required(),
  unitTypeId: Joi.number().required(),
  projectHoldingId: Joi.number().required(),
});
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (req.user?.id) {
      try {
        const payload = req.body as ImportProjectFromHolding;
        const validationResult = requestBodySchema.validate(payload);
        if (!validationResult.error) {
          const uid = await importProjectFromHolding(validationResult.value);
          res.json(uid);
        } else {
          throw new Error(`Issue validating import payload ${validationResult.errors}.`);
        }
      } catch (err) {
        Errors.resJson(res, err as Error, `Error importing product holding ${err}.`);
      }
    }
  },
);

module.exports = Router;
