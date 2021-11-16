// SPDX-License-Identifier: Apache-2.0
import express from 'express';
import { studioCors } from '@cors/studio';
import { User } from '@models/user';
import * as mailer from '@root/mailer';
import Errors from '@root/errors';
const RequestPromise = require('request-promise');
const Router = express.Router();

Router.options('/', studioCors);

Router.post('/', studioCors, (req: express.Request, res: express.Response) => {
  // Google reCAPTCHA
  // TODO: refactor this into a recaptcha module and move the secret into a .env file
  RequestPromise({
    method: 'POST',
    uri: 'https://www.google.com/recaptcha/api/siteverify',
    form: {
      secret: 'REDACTED',
      response: req.body.recaptchaToken,
      remoteip: req.ip,
    },
  })
    .then(googleResult => {
      let obj = JSON.parse(googleResult);
      if (!obj.success) {
        res.json('Bot check failed');
      } else {
        // Validate Username Format
        if (!req.body.username) {
          res.json('Username cannot be blank');
        } else {
          if (User.validateUsername(req.body.username)) {
            res.json('Username may only contain letters and numbers');
          } else {
            // Validate Email Format
            if (!req.body.email) {
              res.json('Email cannot be blank');
            } else {
              if (User.validateEmail(req.body.email)) {
                res.json('Invalid Email Address');
              } else {
                // Create User (checks for duplicates internally)
                User.createArtist(req.body.username, req.body.email)
                  .then(artist => {
                    const passwordLink =
                      'https://www.3xr.com/user/set-password/' +
                      artist.user.id +
                      '+' +
                      artist.resetPasswordToken;
                    const text =
                      'Your 3xr.com account, ' +
                      artist.user.username +
                      ', is almost ready. Copy and paste this address into your browser: ' +
                      passwordLink;
                    const html =
                      '<h2>Your 3xr.com account (<strong>' +
                      artist.user.username +
                      '</strong>) is almost ready</h2><h3><a href="' +
                      passwordLink +
                      '">Click here</a> to set your password or copy and paste this into your browser: ' +
                      passwordLink +
                      '</h3>';
                    mailer.sendMessageToOrganization(
                      artist.user.email,
                      'Welcome to 3XR!',
                      text,
                      html,
                    )
                      .then(mail_result => {
                        if (mail_result.accepted.includes(artist.user.email)) {
                          res.json('success');
                        } else {
                          Errors.resJson(res, null, 'Error sending email');
                        }
                      })
                      .catch((err: Error) => {
                        Errors.resJson(res, err, 'Error sending welcome email');
                      });
                  })
                  .catch((err: Error) => {
                    // TODO: if this fails due to a duplicate username or email, we should return the error string
                    res.json(err);
                    //Errors.resJson(res, err, 'Error creating artist');
                  });
              }
            }
          }
        }
      }
    })
    .catch((err: Error) => {
      Errors.resJson(res, err, 'Error signing up - Google reCAPTCHA');
    });
});

module.exports = Router;
