describe('Latest Features Until Cypress 14', () => {

    it('Cypress Ambassador Status',()=>{
       /* 
          Wed, Dec 13, 2023, 
          The selection process for the 2024 ambassador program was undeniably challenging due to the remarkable
          dedication and quality of engagement from our ambassadors. After extensive and thorough deliberation,
          it is with regret that we inform you that you have not been selected for the upcoming program.
       */
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
    it('cy.stop testing', ()=>{
        // https://docs.cypress.io/api/cypress-api/stop#__docusaurus_skipToContent_fallback
        // Stop the Cypress App on the current machine while tests are running. This can be useful for stopping
        // test execution upon failures or other predefined conditions.

        // cy.stop() will stop the test execution on the current machine. 
        // How to test this?
        // Add an assertion in the prev test and see how the test execution stops.

        // How to activate it? 
        // Add the following code in the support/e2e.ts file
        // afterEach(function () {
        //     if (this.currentTest.state === 'failed') {
        //       Cypress.stop()
        //       return
        //     }
        //   })
    })
    it('Firefox now uses WebDriver BIDI', ()=>{
        //https://www.cypress.io/blog/announcing-cypress-support-for-firefox-over-webdriver-bidi

        // https://www.w3.org/TR/webdriver-bidi/Historically, Cypress used CDP to automate Firefox. 

        // WebDriver BiDi (Bidirectional) is an emerging, cross-browser automation protocol that
        // combines the best aspects of WebDriver Classic and the Chrome DevTools Protocol (CDP).
        // With bi-directional communication built-in, it delivers fast, efficient interactions and provides low-level control over browser automation.
    })
    it('--defaultBrowser testing', ()=>{

        // https://docs.cypress.io/app/references/configuration#Browser
        // Added new defaultBrowser configuration option to specify the default browser to launch.
        // This option only affects the first browser launch; changing this option after the browser
        // is already launched will have no effect. Addresses #6646.

        // Check the cypress.config.ts file and change the defaultBrowser to 'electron'

        // https://github.com/cypress-io/cypress/issues/6646
    })
})