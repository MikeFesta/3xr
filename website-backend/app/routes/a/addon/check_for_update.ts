// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { JobStatusTypeEnum } from '@enums';
import { BlenderAddon } from '@models/blender_addon';
import { Job } from '@models/jobs/job';

const Router = express.Router();

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  Job.scope({ method: ['forProductUid', req.body.uid] })
    .findOne()
    .then((job: any) => {
      if (job.statusId == JobStatusTypeEnum.ASSIGNED) {
        return job.setStatus(JobStatusTypeEnum.IN_PROGRESS);
      } else if (job.statusId == JobStatusTypeEnum.REVISION_NEEDED) {
        return job.setStatus(JobStatusTypeEnum.IN_REWORK);
      } else {
        Promise.resolve(null);
      }
    })
    .then((statusUpdate: any) => {
      return BlenderAddon.findLatestVersion();
    })
    .then((latest: any) => {
      res.json(latest.version);
    })
    .catch((err: Error) => {
      res.json('');
    });
});

module.exports = Router;
