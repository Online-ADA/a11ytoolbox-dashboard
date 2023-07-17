describe('template spec', () => {
  it('Can login', () => {
    cy.visit('/')
    cy.wait(1000);
    // cy.url().should('be.equals', Cypress.env('accountsDomain') + '/signin/')
    // cy.get('input[type="email"]').type(Cypress.env('user'));
    // cy.get('input[type="password"]').type(Cypress.env('pass'))
    // cy.get('button[type="submit"]').click();
  })
})