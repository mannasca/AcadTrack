// cypress/e2e/login.cy.js

describe('Login E2E Test', () => {
  it('should successfully login with valid credentials', () => {
    cy.visit('/login');
    
    // Enter email
    cy.get('input[type="email"]').type('anassattar.63@gmail.com');
    
    // Enter password
    cy.get('input[type="password"]').type('anas.123');
    
    // Click submit button
    cy.get('button[type="submit"]').click();
    
    // Verify successful login - should redirect to dashboard
    cy.url().should('include', '/dashboard');
    cy.get('.navbar').should('be.visible');
  });
});
