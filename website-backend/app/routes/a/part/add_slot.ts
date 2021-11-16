// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import Errors from '@root/errors';
import helpers from '@root/helpers';
import { Part } from '@models/part';
import PartSlot from '@root/models/part_slot';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    if (!req.user?.admin) {
      Errors.resAdminOnly(res);
    } else {
      const part = await Part.findByPk(req.body.partId);
      if (!part) {
        Errors.resJsonWithCode(res, null, 'Part Not Found', 404);
      } else {
        try {
          await PartSlot.create({
            partId: part.id,
            slotName: helpers.convertToAlphaSnakeCase(req.body.name),
          });
          res.json('success');
        } catch (err) {
          Errors.resJson(res, err as Error, 'Unable to create part slot');
        }
      }
    }
  },
);

module.exports = Router;
