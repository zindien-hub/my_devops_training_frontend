describe('Student form page', () => {
  beforeEach(() => {
    cy.window().then((win) => {
      win.localStorage.setItem('auth_token', 'mocked-jwt-token');
    });
  });

  it('should create a student and redirect to detail page', () => {
    cy.intercept('POST', '/api/students', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Tom',
        lastName: 'Sawyer'
      }
    }).as('createStudentRequest');

    cy.visit('/students/new');

    cy.get('input[formcontrolname="firstName"]').type('Tom');
    cy.get('input[formcontrolname="lastName"]').type('Sawyer');

    cy.get('form').submit();

    cy.wait('@createStudentRequest');
    cy.url().should('include', '/students/1');
  });

  it('should load student data, update it and redirect to detail page', () => {
    cy.intercept('GET', '/api/students/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Tom',
        lastName: 'Sawyer'
      }
    }).as('getStudentRequest');

    cy.intercept('PUT', '/api/students/1', {
      statusCode: 200,
      body: {
        id: 1,
        firstName: 'Tom-Updated',
        lastName: 'Sawyer-Updated'
      }
    }).as('updateStudentRequest');

    cy.visit('/students/1/edit');

    cy.wait('@getStudentRequest');

    cy.get('input[formcontrolname="firstName"]').clear().type('Tom-Updated');
    cy.get('input[formcontrolname="lastName"]').clear().type('Sawyer-Updated');

    cy.get('form').submit();

    cy.wait('@updateStudentRequest');
    cy.url().should('include', '/students/1');
  });
});