describe('My First Test', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000')
    })
    it('cy.press testing', () => {
        // https://docs.cypress.io/api/commands/press
        // Unlike cy.type(), which is best for typing character keys,
        // cy.press() will dispatch real keyboard events rather than simulated ones.
        // This command is especially useful when testing focus management and keyboard navigation 
        // _ patterns which are critical for accessibility testing and great keyboard UX.
        cy.get('[data-testid="login-username"]').focus()
        cy.press(Cypress.Keyboard.Keys.TAB)
        cy.press(Cypress.Keyboard.Keys.TAB)
        cy.get('[data-testid="login-password"]').should('have.focus')
    })
})