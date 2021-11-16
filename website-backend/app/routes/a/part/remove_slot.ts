// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import Errors from '@root/errors';
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
          const partSlot = await PartSlot.findByPk(req.body.id);
          await partSlot?.destroy();
          res.json('success');
        } catch (err) {
          Errors.resJson(res, err as Error, 'Unable to remove part slot');
        }
      }
    }
  },
);

module.exports = Router;
