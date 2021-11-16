// SPDX-License-Identifier: Apache-2.0
import Vue from 'vue';
import fs from 'fs';
import NodeMailer from 'nodemailer';
import { createRenderer } from 'vue-server-renderer';
import { JSDOM } from 'jsdom';
import { NotificationContext, Component, TemplateRequest, MailInfo, EmailRequest } from '@types';
import { EmailType } from '@enums';
import Credentials from '../../.credentials/mailer.json'; // This file was REDACTED and you need to provide your own
import Log from '../log';
import EmailLog from '../models/emailLog';
import helpers from '../helpers';
require('dotenv').config();

let baseDir = __dirname;

const BASE_TEMPLATE = fs.readFileSync(`${baseDir}/templates/base.template.html`, 'utf-8');
const notificationTemplate = fs.readFileSync(`${baseDir}/templates/notification.template.html`, 'utf-8');

const renderer = createRenderer();

const createTemplateInstance = (
  context: NotificationContext,
  template: string = notificationTemplate,
): Component | undefined => {
  return new Vue({
    data: {
      ...context,
    },
    template,
  });
};

// based on templateRequest.emailType decides which Vue component to render and creates a context
async function generateHtml(templateRequest: TemplateRequest): Promise<MailInfo | undefined> {
  let subject = '';
  let html = '';
  switch (templateRequest.type) {
    case EmailType.COMMENT:
      subject = 'A Comment Has Been Made On Your Product';
      html = await renderComponent(
        createTemplateInstance({
          header: subject,
          content: `${templateRequest.commentatorName} left a comment on ${templateRequest.product?.name}, please review at your convenience.`,
          href: `${templateRequest.product?.href}`,
          buttonText: 'View comment',
        }),
      );
      return { html, subject };
    case EmailType.CLIENT_QA:
      subject = 'Asset Ready For Review';
      html = await renderComponent(
        createTemplateInstance({
          header: subject,
          content: `${templateRequest.product?.name} is ready to review - Log in here to QA your model`,
          href: `${templateRequest.product?.href}`,
          buttonText: 'Review asset',
        }),
      );
      return { html, subject };
    case EmailType.JOB_IN_REVISION:
      subject = 'Revision Requested';
      html = await renderComponent(
        createTemplateInstance({
          header: subject,
          content: `${templateRequest.product?.name} has been sent back to our artists with your feedback, we will notify you again when your requested revisions have been made. Please expect a 48 hour turnaround.`,
          href: `${templateRequest.product?.href}`,
          buttonText: 'Review asset',
        }),
      );
      return { html, subject };
    case EmailType.PO_IN_PROGRESS:
      subject = 'Purchase Order Is In Progress';
      html = await renderComponent(
        createTemplateInstance({
          header: subject,
          content: `${templateRequest.project?.name} has begun production with 3XR artists. From here you will receive updates as your models become ready for your review.`,
          href: `${templateRequest.project?.href}`,
          buttonText: 'Review project',
        }),
      );
      return { html, subject };
    default:
      return;
  }
}

function renderComponent(component: Component, baseTemplate: string = BASE_TEMPLATE): Promise<string> {
  let resolve: any;
  let reject: any;
  const promise = new Promise<string>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  renderer.renderToString(component, (err, html) => {
    if (err) {
      reject('');
    }

    // render base template and insert generated HTML inside #main div
    const dom = new JSDOM(baseTemplate);
    const el = dom.window.document.getElementById('main');
    if (el) {
      el.innerHTML = html;
    }
    const result = dom.serialize();

    resolve(result);
  });
  return promise;
}

class Email {
  async generateTemplate(request: TemplateRequest): Promise<EmailRequest | null> {
    try {
      // user has disabled email notifications
      if (!request.user.emailNotifications) {
        return null;
      }

      const mailRequest = await generateHtml(request);
      if (mailRequest) {
        return {
          email: request.user.email,
          html: mailRequest.html,
          subject: mailRequest.subject,
          bcc: request.bcc || [],
        };
      } else {
        return null;
      }
    } catch (_) {
      return null;
    }
  }

  async generateTemplates(requests: TemplateRequest[]): Promise<EmailRequest[] | null> {
    try {
      const promises = await Promise.all(
        requests.map(async request => {
          const template = await this.generateTemplate(request);
          if (template) {
            return template;
          } else {
            return undefined;
          }
        }),
      );
      return promises.filter(helpers.notUndefinedPredicate);
    } catch (err) {
      return null;
    }
  }

  async sendEmail({ email, subject, html, bcc = [] }: EmailRequest): Promise<void> {
    if (process.env.EMAIL_ENABLED !== 'true') {
      return undefined;
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

    try {
      await transporter.verify();
    } catch (err) {
      Log.error(`Mail verification error: ${err}`);
    }

    try {
      await helpers.waitMs(100);
      await transporter.sendMail({
        from: '3XR Support <support@3xr.com>',
        to: email,
        subject,
        html,
        bcc,
      });

      await EmailLog.create({
        emailTo: email,
        subject,
        html,
      });
    } catch (err) {
      Log.error(`Send email error: ${err}`);
    }
  }

  async sendEmails(requests: EmailRequest[]): Promise<void[]> {
    return Promise.all(requests.map(async request => await this.sendEmail(request)));
  }
}

export default new Email();
