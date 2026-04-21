describe('Login page', () => {
  it('should login and redirect to students page', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: {
        token: 'mocked-jwt-token'
      }
    }).as('loginRequest');

    cy.visit('/login');

    cy.get('input[formcontrolname="login"]').type('john.doe');
    cy.get('input[formcontrolname="password"]').type('password123');

    cy.get('form').submit();

    cy.wait('@loginRequest');
    cy.url().should('include', '/students');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('auth_token')).to.equal('mocked-jwt-token');
    });
  });
});