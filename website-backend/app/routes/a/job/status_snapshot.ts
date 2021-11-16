// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import moment from 'moment-timezone';
import sequelize = require('sequelize');
import { studioCors } from '@cors/studio';
import { JobStatusSnapshot } from '@models/jobs/job_status_snapshot';

import ConnectEnsureLogin from 'connect-ensure-login';
import Errors from '@root/errors';
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  studioCors,
  ConnectEnsureLogin.ensureLoggedIn('/a/user/unauthorized'),
  (req: express.Request, res: express.Response) => {
    JobStatusSnapshot.findAll({
      // Load only the past 7 days
      where: {
        date: { [sequelize.Op.gte]: moment.tz(moment().subtract(6, 'days'), 'America/New_York').format('YYYY-MM-DD') },
      },
    })
      .then((results: any) => {
        res.json(results);
      })
      .catch((err: Error) => {
        Errors.resJson(res, err, 'Unable to load job status snapshots');
      });
  },
);

module.exports = Router;
