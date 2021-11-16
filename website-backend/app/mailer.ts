// SPDX-License-Identifier: Apache-2.0
const Credentials = require.main?.require('../.credentials/mailer.json'); // This file is not provided in the repo
import Log from '@root/log';
import NodeMailer from 'nodemailer';

// Array returned by SMTP transports
// (includes recipient addresses that were accepted by the server), we have the typings installed BUT, they are not covering sendmail response
export type SMPTPResponse = any[]

// see https://nodemailer.com/usage/
export type MailerResult = {
  messageId: number;
  envelope: any;
  accepted: SMPTPResponse,
  rejected: SMPTPResponse,
  pending: SMPTPResponse,
  response: string
}

export const sendMessageToOrganization = (to: string, subject: string, text: string, html?: string): Promise<MailerResult> => {
  return new Promise((resolve, reject) => {
    if (!html) {
      html = text;
    }
    const transporter = NodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        type: 'OAuth2',
        user: 'support@3xr.com',
        serviceClient: Credentials.client_id,
        privateKey: Credentials.private_key,
      },
    });
    transporter
      .verify()
      .then(verifyResult => {
        if (verifyResult) {
          transporter
            .sendMail({
              from: '3XR Support <support@3xr.com>',
              to: to,
              subject: subject,
              text: text,
              html: html,
            })
            .then(mailerResult => {
              resolve(mailerResult as unknown as MailerResult);
            })
            .catch((err: Error) => {
              Log.error('Send Mail Error: ' + err);
              reject(err);
            });
        }
      })
      .catch((err: Error) => {
        Log.error('Mail Verification Error: ' + err);
        reject(err);
      });
  });
};

export default sendMessageToOrganization;
