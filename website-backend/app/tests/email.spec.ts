// SPDX-License-Identifier: Apache-2.0
import Email from '../email/email';
import { TemplateRequest } from '@types';
import { EmailType } from '@enums';

describe('Email service:', () => {
  describe('* template generation', () => {
    let user: any;
    let product: any;
    let project: any;
    beforeEach(() => {
      user = { email: 'user@user.com', firstName: 'First', lastName: 'Last', emailNotifications: true };
      product = { name: 'productName', href: 'http://www.product.link' };
      project = { name: 'projectName', href: 'http://www.project.link' };
    });
    it('should correctly generate CLIENT_QA email', async () => {
      const templateRequest = await Email.generateTemplate({
        user,
        product,
        type: EmailType.CLIENT_QA,
      });
      expect(templateRequest?.email).toEqual('user@user.com');
      expect(templateRequest?.html).toMatchSnapshot();
    });
    it('should correctly generate JOB_IN_REVISION email', async () => {
      const templateRequest = await Email.generateTemplate({
        user,
        product,
        type: EmailType.JOB_IN_REVISION,
      });
      expect(templateRequest?.email).toEqual('user@user.com');
      expect(templateRequest?.html).toMatchSnapshot();
    });
    it('should correctly generate COMMENT email', async () => {
      const templateRequest = await Email.generateTemplate({
        user,
        product,
        type: EmailType.COMMENT,
        commentatorName: 'Commentator User',
      });
      expect(templateRequest?.email).toEqual('user@user.com');
      expect(templateRequest?.html).toMatchSnapshot();
    });
    it('should correctly generate PO_IN_PROGRESS email', async () => {
      const templateRequest = await Email.generateTemplate({
        user,
        project,
        type: EmailType.PO_IN_PROGRESS,
      });
      expect(templateRequest?.email).toEqual('user@user.com');
      expect(templateRequest?.html).toMatchSnapshot();
    });
    it('should correctly assign bcc', async () => {
      const templateRequest = await Email.generateTemplate({
        user,
        project,
        type: EmailType.PO_IN_PROGRESS,
        bcc: ['test@email.com', 'test2@email.com'],
      });
      expect(templateRequest?.bcc).toEqual(['test@email.com', 'test2@email.com']);
    });
    it('should correctly generate multiple emails', async () => {
      const requests: TemplateRequest[] = [
        {
          type: EmailType.COMMENT,
          user: { email: 'first@email.com', firstName: 'first', lastName: 'last', emailNotifications: true },
          product,
          commentatorName: 'Commentator User',
        },
        {
          type: EmailType.JOB_IN_REVISION,
          user: { email: 'second@email.com', firstName: 'first', lastName: 'last', emailNotifications: true },
          product,
        },
      ];
      const templateRequests = await Email.generateTemplates(requests);
      if (templateRequests) {
        templateRequests.forEach((templateRequest, idx) => {
          expect(templateRequest?.email).toEqual(requests[idx].user.email);
          expect(templateRequest?.html).toMatchSnapshot();
        });
      }
    });
    it('should not generate emails for users with disabled emailNotifications', async () => {
      const requests: TemplateRequest[] = [
        {
          type: EmailType.COMMENT,
          user: { email: 'first@email.com', firstName: 'first', lastName: 'last', emailNotifications: false },
          product,
          commentatorName: 'Commentator User',
        },
        {
          type: EmailType.JOB_IN_REVISION,
          user: { email: 'second@email.com', firstName: 'first', lastName: 'last', emailNotifications: true },
          product,
        },
      ];

      const templateRequests = await Email.generateTemplates(requests);

      if (templateRequests) {
        expect(templateRequests?.length).toEqual(1);
        expect(templateRequests[0].email).toBe('second@email.com');
      } else {
        console.log(templateRequests);
        throw new Error('template requests were not generated');
      }
    });
  });
});
