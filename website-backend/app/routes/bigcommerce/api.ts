// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { createProjectHolding } from '@services/integrations/bigcommerce/PurchaseOrderUseCases';
import { getProductAndJobStates, createProductHolding } from '@services/integrations/bigcommerce/ProductUseCases';
import { bcBCProductArraySchema, bcProjectHoldingCreateSchema } from '@root/services/integrations/bigcommerce/Models';
import Errors from '@root/errors';
import ProjectHolding from '@root/models/project_holding';
import UserClient from '@root/models/user_client';
import Product from '@root/models/product';
import Asset from '@root/models/asset';
import Job from '@root/models/jobs/job';
import { JobStatusTypeEnum } from '@enums';
import User from '@root/models/user';
import Log from '@root/log';
const Router = express.Router();

/*
Route handlers for /a/bigcommerce to handle requests incoming from BigCommerce server.
All routes require Bearer token in request header.
*/

Router.get('/health', studioCors, (req, res) => {
  res.status(200).send('ok');
});

Router.get('/products/statuses', studioCors, async (req: express.Request, res: express.Response) => {
  if (req.user) {
    try {
      const productAndJobStates = await getProductAndJobStates(req.user.id);
      res.send(productAndJobStates);
    } catch (err) {
      Log.error(`Error getting product states ${err}.`);
      Errors.resJson(res, err as Error, 'Error getting product states.');
    }
  } else {
    res.status(403).send('Unauthorized');
  }
});

// CREATE
Router.post('/purchase-order', studioCors, async (req: express.Request, res: express.Response) => {
  if (req.user) {
    try {
      const { value, error } = bcProjectHoldingCreateSchema.validate(req.body, { allowUnknown: true });

      if (error) {
        throw new Error(error.message);
      }

      const project = await createProjectHolding(req.user.id, value);

      res.json({ project });
    } catch (err) {
      const errorMessage = `Error creating a Purchase Order holding record from BigCommerce ${err}.`;
      Errors.resJson(res, err as Error, errorMessage);
    }
  } else {
    res.sendStatus(403).send('Unauthorized');
  }
});

// READ
Router.get(
  '/purchase-order',
  studioCors,
  async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.user) {
      try {
        const userClient = await UserClient.findOne({
          where: {
            userId: req.user.id,
          },
        });
        if (!userClient) {
          throw new Error('could not find client id');
        }

        const projectHoldings = await ProjectHolding.findAll({
          where: {
            clientId: userClient.clientId,
          },
        });

        if (projectHoldings) {
          res.json({ projectHoldings });
        } else {
          throw new Error('could not find project holding');
        }
      } catch (err) {
        Log.error((err as Error).message);
        Errors.resJson(res, err as Error, (err as Error).message || 'could not get project holdings');
      }
    }
  },
);

// CREATE
Router.post('/products', studioCors, async (req: express.Request, res: express.Response) => {
  if (req.user) {
    try {
      const validationResult = bcBCProductArraySchema.validate(req.body);
      if (!validationResult.error) {
        const result = await createProductHolding(req.user.id, validationResult.value);
        res.json(result);
      } else {
        throw new Error(validationResult.error.message);
      }
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to creeate purchase order.');
    }
  } else {
    res.sendStatus(403).send('Unauthorized');
  }
});

Router.post('/asset/:bcProductId', studioCors, async (req: express.Request, res: express.Response) => {
  const { bcProductId } = req.params;

  try {
    const product = await Product.findOne({ where: { bcProductId } });
    if (!product) {
      throw new Error('could not find product');
    }

    const job = await Job.findOne({ where: { productId: product.id } });
    if (!job) {
      throw new Error('could not find job');
    }

    if (job.statusId !== JobStatusTypeEnum.COMPLETE) {
      throw new Error('asset not completed production');
    }

    const asset = await Asset.findByPk(product.assetId);
    if (!asset) {
      throw new Error('could not find asset');
    }

    const { uid, name } = asset;
    const assetUrls = ['.usdz', '.glb'].map(ext => `https://cdn.3xr.com/models/${uid}/${name}${ext}`);

    res.json(assetUrls);
  } catch (err) {
    console.error(err);
    res.sendStatus(500).send(`Error: ${err}`);
  }
});

// TODO: this might not be needed now that JWT can carry user payload
Router.get('/user', async (req, res, next) => {
  try {
    const user = await User.scope('name').findByPk(req.user?.id);
    if (!user) {
      throw new Error('couldnt find user');
    }
    res.json(user);
  } catch (err) {
    res.sendStatus(500).send(`Error: ${err}`);
  }
});

export default Router;
