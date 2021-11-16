// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { ProductVertical } from '@models/product_vertical';
import { UnitType } from '@models/unit_type';
import Log from '@root/log';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    Promise.all([
      ProductVertical.findAll({ order: [['name', 'ASC']] }),
      UnitType.findAll({ order: [['id', 'ASC']] }),
    ])
      .then(results => {
        return res.json({
          brands: [{ id: 1, name: 'Brand Placeholder' }],
          verticals: results[0],
          units: results[1],
        });
      })
      .catch((err: Error) => {
        Log.error('Error getting product drop downs' + req.params.uid);
        Log.error(err);
        return res.json('error getting product drop downs');
      });
  },
);

module.exports = Router;
