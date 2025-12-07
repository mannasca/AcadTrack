// cypress/support/commands.js

// Custom command to login
Cypress.Commands.add('login', (email = 'anassattar.63@gmail.com', password = 'anas.123') => {
  cy.visit('/login');
  cy.get('input[type="email"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('include', '/dashboard');
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.visit('/dashboard');
  cy.get('[role="img"]').parent().click(); // Click user profile button
  cy.contains('Logout').click();
  cy.url().should('include', '/login');
});

// Custom command to verify authenticated state
Cypress.Commands.add('checkAuthenticated', () => {
  cy.visit('/dashboard');
  cy.url().should('not.include', '/login');
  cy.get('button[type="submit"]').should('not.exist'); // No login button on dashboard
});
