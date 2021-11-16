// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetFile } from '@models/asset_file';
import Errors from '@root/errors';
import { Op } from 'sequelize';
import internalOnlyFilter from '@root/access/internal_only';
import moment from 'moment';
import Asset from '@root/models/asset';
const Router = express.Router();

Router.get(
  '/',
  studioCors,
  internalOnlyFilter,
  async (req: express.Request, res: express.Response) => {
    try {
      const files = await AssetFile.findAll({
        attributes: ['filename'],
        include: [
          {
            attributes: ['uid'],
            model: Asset,
            as: 'asset',
          }
        ],
        where: {
          createdAt: { [Op.gt]: moment().subtract(7, 'days').format('YYYY-MM-DD') },
          typeId: 13
        }
      });
      if (files) {
        res.json(files);
      } else {
        Errors.resJson(res, null, 'Unable to find asset files')
      }
    } catch (err) {
      Errors.resJson(res, err as Error, 'Unable to load file list');
    }
  },
);

module.exports = Router;
