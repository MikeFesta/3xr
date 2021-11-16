import express from 'express';
import { studioCors } from '@cors/studio';
import { Job } from '@models/jobs/job';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/:uid',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  async (req: express.Request, res: express.Response) => {
    try {
      const job = await Job.findOne({ where: { uid: req.params.uid } })
      if (job) {
        job.deleted = true;
        await job.save();
        res.json(req.params.uid);
      } else {
        throw new Error(`Unable to delete the job. Cannot find a Job with a uid of ${req.params.uid}.`);
      }
    } catch (err) {
      res.json(err)
    }
  },
);

module.exports = Router;
