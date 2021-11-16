import express from 'express';
import { studioCors } from '@cors/studio';
import { AssetComplexityType } from '@models/asset_complexity_type';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.get(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    AssetComplexityType.scope('picklist')
      .findAll()
      .then(picklist => {
        res.json(picklist);
      })
      .catch((err: Error) => Errors.resJson(res, err, 'Error getting picklist'));
  },
);

module.exports = Router;
