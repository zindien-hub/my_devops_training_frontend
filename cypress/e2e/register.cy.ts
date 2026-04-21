describe('Register page', () => {
  it('should register a user and redirect to login page', () => {
    cy.intercept('POST', '/api/register', {
      statusCode: 200,
      body: {}
    }).as('registerRequest');

    cy.visit('/register');

    cy.get('input[formcontrolname="firstName"]').type('John');
    cy.get('input[formcontrolname="lastName"]').type('Doe');
    cy.get('input[formcontrolname="login"]').type('john.doe');
    cy.get('input[formcontrolname="password"]').type('password123');

    cy.get('form').submit();

    cy.wait('@registerRequest');
    cy.url().should('include', '/login');
  });
});