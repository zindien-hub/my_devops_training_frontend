describe('Student delete flow', () => {
  it('should delete a student from the list', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mocked-jwt-token');
    });

    cy.intercept('GET', '/api/students', {
      statusCode: 200,
      body: [
        { id: 1, firstName: 'Tom', lastName: 'Sawyer' }
      ]
    }).as('studentsRequest');

    cy.intercept('DELETE', '/api/students/1', {
      statusCode: 204,
      body: null
    }).as('deleteStudentRequest');

    cy.visit('/students');

    cy.wait('@studentsRequest');

    cy.on('window:confirm', () => true);

    cy.contains('button', 'Delete').click();

    cy.wait('@deleteStudentRequest');
    cy.get('@deleteStudentRequest.all').should('have.length', 1);
  });
});