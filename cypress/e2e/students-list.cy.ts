describe('Students list page', () => {
  it('should display mocked students after login', () => {
    cy.intercept('POST', '/api/login', {
      statusCode: 200,
      body: {
        token: 'mocked-jwt-token'
      }
    }).as('loginRequest');

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'Tom', lastName: 'Sawyer' },
        { id: 2, firstName: 'Huck', lastName: 'Finn' }
      ]
    }).as('studentsRequest');

    cy.visit('/login');

    cy.get('input[formcontrolname="login"]').type('john.doe');
    cy.get('input[formcontrolname="password"]').type('password123');
    cy.get('form').submit();

    cy.wait('@loginRequest');
    cy.wait('@studentsRequest');

    cy.url().should('include', '/students');
    cy.contains('Tom').should('be.visible');
    cy.contains('Sawyer').should('be.visible');
    cy.contains('Huck').should('be.visible');
    cy.contains('Finn').should('be.visible');

    cy.contains('Add a new student').should('be.visible');
    cy.contains('View').should('be.visible');
    cy.contains('Edit').should('be.visible');
  });
});