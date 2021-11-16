// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { MailingList } from '@models/mailing_list';
import { studioCors } from '@cors/studio';
import * as mailer from '@root/mailer';
import Log from '@root/log';
const { check, validationResult } = require('express-validator');
const Router = express.Router();

Router.options('/', studioCors);

Router.post(
  '/',
  [
    check('firstName').isLength({ min: 1 }),
    check('lastName').isLength({ min: 1 }),
    //check('message').isLength({min: 1}),
    check('email').isEmail(),
  ],
  studioCors,
  (req: express.Request, res: express.Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      Log.debug('Invalid contact us form submission');
      res.json('FAILURE');
    } else {
      MailingList.create({
        name: req.body.firstName + ' ' + req.body.lastName,
        email: req.body.email,
        interest: req.body.interest,
        phone: req.body.phone,
        comanpy: req.body.company,
        message: req.body.message,
        ip: req.ip,
      })
        .then(result => {
          const text =
            req.body.firstName +
            ' ' +
            req.body.lastName +
            '; ' +
            req.body.email +
            '; ' +
            req.body.phone +
            '; ' +
            req.body.company +
            '; ' +
            req.body.interest +
            '; ' +
            req.body.message;
          mailer.sendMessageToOrganization(
            'sales@3xr.com',
            'New Website Contact!',
            text,
            text,
          )
            .then(mail_result => {
              res.json('success');
            })
            .catch((err: Error) => {
              res.json('success');
            });
        })
        .catch((err: Error) => {
          res.json('failure');
        });
    }
  },
);

module.exports = Router;
