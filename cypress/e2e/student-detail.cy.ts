describe('Student detail page', () => {
  it('should display mocked student details', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mocked-jwt-token');
    });

    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Tom',
        lastName: 'Sawyer',
        createdAt: '2026-04-19T10:00:00',
        updatedAt: '2026-04-19T10:05:00'
      }
    }).as('studentDetailRequest');

    cy.visit('/students/1');

    cy.wait('@studentDetailRequest');

    cy.url().should('include', '/students/1');
    cy.contains('Student detail').should('be.visible');
    cy.contains('Tom').should('be.visible');
    cy.contains('Sawyer').should('be.visible');
    cy.contains('2026-04-19T10:00:00').should('be.visible');
    cy.contains('2026-04-19T10:05:00').should('be.visible');
    cy.contains('Back to list').should('be.visible');
    cy.contains('Edit').should('be.visible');
  });
});