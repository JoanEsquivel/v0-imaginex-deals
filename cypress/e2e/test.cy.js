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

    it('Cypress Cloud', ()=>{
        // https://www.cypress.io/cloud

        // Set the projectId in the cypress.config.ts file
        // Run your tests in your favorite CI provider with a record key: 
        // For instance: npx cypress run --record --key {{your-record-key}}
        // Also, you can set the record key in your environment: export CYPRESS_RECORD_KEY={{your key}}
        // Then, you just need to add the --record flag to your cypress run command

        // Features I wanted to review: 
        // Test Replay
        // Wind back the clock to any point in an application's execution and see exactly what it was doing during the point of failure. Inspect the DOM, network events, and console logs of your application from your tests exactly as they ran in CI.


        // Branch Review
        // Understand whether you've introduced or resolved failed, flaky, or pending tests. Analyze the impact of your branch's latest pull request by reviewing the before-and-after of test suite changes side-by-side.

        // Failure Debugging
        // Every test run error is captured, grouped, and accompanied by a detailed stack trace output that gives you the information you need to identify the exact point of failure in your application.

        // Visualize Coverage
        // UI Coverage provides a visual overview of test coverage across every page and component of your app, offering clear insights into uncovered areas that everyone can understand.

        // Automated accessibility checks on every test
    })
})