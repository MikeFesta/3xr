import express from 'express';
import { studioCors } from '@cors/studio';
import { createDeleteRecord, deleteRecords, DeleteRecord } from '@services/Projects';
import Log from '@root/log';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/:uid', studioCors);

Router.post(
  '/:uid',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      // prepare all IDs in associated tables if project exists
      const deleteRecord: DeleteRecord | null = await createDeleteRecord(req.params.uid);
      if (deleteRecord) {
        await deleteRecords(deleteRecord);
      }
      res.json('success');
    } catch (err) {
      Log.error(err);
      res.json('error deleting project');
    }
  },
);

module.exports = Router;
