describe('Homepage tests', () => {
  const BASE_URL = Cypress.env('XR_FRONTEND_URL');

  context('When 3XR homepage is opened', () => {
    const loginSelector = '.login-btn, .outline-btn';

    it('Login button navigates to login page', () => {
      cy.visit(BASE_URL).get(loginSelector).click();
      cy.url().should('eq', `${BASE_URL}/login`);
    });
    it('Successfully logs in a user', () => {
      const usernameInput = 'input[name=username]';
      const passwordInput = 'input[name=password]';
      cy.visit(BASE_URL).get(loginSelector).click();
      cy.get(usernameInput).type('e2e-client');
      cy.get(passwordInput).type('j46B3WEDXv5S');
      cy.get('#login').click();
      cy.url().should('eq', `${BASE_URL}/admin/dashboard`);
    });
  });
});
