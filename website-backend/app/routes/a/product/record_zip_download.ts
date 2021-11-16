// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { JobStatusTypeEnum } from '@enums';
import { Job } from '@models/jobs/job';
import { Product } from '@models/product';
import Errors from '@root/errors';
import ConnectEnsureLogin from 'connect-ensure-login';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/user/login'),
  (req: express.Request, res: express.Response) => {
    Job.findOne({
      include: [
        {
          as: 'product',
          model: Product,
          where: { uid: req.body.uid },
        },
      ],
    })
      .then((job: any) => {
        if (job.product.artistUserId != req.user?.id && !req.user?.admin) {
          Errors.resJson(res, null, 'You are not authorized to change the status of this job');
        } else {
          // Only set to in progress if it is assigned
          if (job.statusId == JobStatusTypeEnum.ASSIGNED) {
            return job
              .setStatus(JobStatusTypeEnum.IN_PROGRESS)
              .then((statusLog: any) => {
                res.json('success');
              })
              .catch((err: Error) => Errors.resJson(res, err, 'Error changing job status'));
          } else {
            res.json('success - nothing to change');
          }
        }
      })
      .catch((err: Error) => Errors.resJson(res, err, 'Error finding job ' + req.body.uid));
  },
);

module.exports = Router;
