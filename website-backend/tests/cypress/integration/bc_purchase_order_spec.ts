describe('BigCommerce purchase order flow tests', () => {
  const BC_BASE_URL = Cypress.env('BC_FRONTEND_URL');
  const XR_BASE_URL = Cypress.env('XR_FRONTEND_URL');

  context('When BigCommerce UI page is opened', () => {
    it('Begin button is present', () => {
      cy.visit(BC_BASE_URL).get('#begin').click();
      cy.get('#login').should('exist');
    });
    it('Successfully logs in a user', () => {
      cy.visit(BC_BASE_URL).get('#begin').click();

      const usernameInput = 'input[name=username]';
      const passwordInput = 'input[name=password]';
      cy.get(usernameInput).type('e2e-client');
      cy.get(passwordInput).type('j46B3WEDXv5S');
      cy.get('#login').click();

      cy.get('#auth').should('exist');
      cy.get('#auth button span div').contains(' Connected to 3XR as e2e e2e');
    });
    it('user is able to select products and create a purchase order', () => {
      cy.exec('npm run db:holdings:reset').then(() => {
        cy.visit(BC_BASE_URL).get('#begin').click();

        const usernameInput = 'input[name=username]';
        const passwordInput = 'input[name=password]';
        cy.get(usernameInput).type('e2e-client');
        cy.get(passwordInput).type('j46B3WEDXv5S');
        cy.get('#login').click();

        // wait for products
        cy.wait(5000);
        // cy.get('tbody tr:first td').eq(2).should('contain.text', 'XR-BOX');

        // select 2 products
        cy.get('.text-start').eq(2).find('i').click();
        cy.get('.text-start').eq(4).find('i').click();

        // create purchase order
        cy.get('#create-po').should('be.enabled');
        cy.get('#create-po').click();
        cy.get('#po-name').type('e2e-purchase-order');
        cy.get('#submit-po').click();

        // assert purchase order has been created
        cy.get('#exported-table tbody').find('tr').should('have.length', 2);
      });
    });

    it('user is able to import project holding', () => {
      const loginSelector = '.login-btn, .outline-btn';
      cy.visit(XR_BASE_URL).get(loginSelector).click();

      const usernameInput = 'input[name=username]';
      const passwordInput = 'input[name=password]';
      cy.get(usernameInput).type('e2e-client');
      cy.get(passwordInput).type('j46B3WEDXv5S');
      cy.get('#login').click();

      cy.get("a[href$='/client/purchase-orders']").click();
      cy.visit(`${XR_BASE_URL}/client/purchase-order/new`);

      // select project holding
      cy.get('#product-group-input').focus().click({ force: true });
      // click on first option
      cy.get('.v-list-item--link[role$="option"]').first().click();
      cy.get('#product-group-input').blur({ force: true });

      // select brand
      cy.get('[data-test=po-form-brand-input]').parent().click();
      cy.get('.v-menu__content').contains('TEST BRAND').click();

      // select class
      cy.get('[data-test=po-form-cls-input]').parent().click();
      cy.get('.v-menu__content').contains('TEST CLASS').click();

      // open purchase order
      cy.get('#submit').click();

      // verify that 2 products have `Needs Review` status
      cy.get('[data-test="Assembled Vertuso Chrome Box"]')
        .find('[data-test=job-status-label] span')
        .contains('Needs review');
      cy.get('[data-test="Assembled Nespresso Vertuo Plus Grey"]')
        .find('[data-test=job-status-label] span')
        .contains('Needs review');

      // verify product reviewing
      cy.get('[data-test="Assembled Vertuso Chrome Box"]').find('[data-test=job-status-label]').click();

      // approve product
      cy.get('[data-test=save-and-approve]').click();

      // verify product has `Ready to submit` status

      // failing until PLAT-729 is resolved
      // cy.get('[data-test="Assembled Vertuso Chrome Box"]')
      //   .find('[data-test=job-status-label] span')
      //   .contains('Ready to submit');

      // approve 2nd product and verify status
      cy.get('[data-test="Assembled Nespresso Vertuo Plus Grey"]').find('[data-test=job-status-label]').click();
      cy.get('#height').type('10');
      cy.get('#width').type('10');
      cy.get('#depth').type('10');
      cy.get('[data-test=save-and-approve]').focus().click();
      // cy.get('[data-test="Assembled Nespresso Vertuo Plus Grey"]')
      //   .find('[data-test=job-status-label] span')
      //   .contains('Ready to submit');

      // submit project
      cy.get('[data-test=submit-project]').click();
      cy.get('[data-test=submit-project-confirm]').click();
      cy.get('[data-test=close-confirm-dialog]').click();

      // verify project is in pending state
      cy.get('[data-test=purchase-order-status]').contains('Pending');
    });
  });
});
