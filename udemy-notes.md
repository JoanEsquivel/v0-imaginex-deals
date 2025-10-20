# Manual for students

## How to setup Playwright in your project? Manually

1- Full guideline: [Installation](https://playwright.dev/docs/intro)
  * pnpm create playwright

2- If it just scaffold a test folder, let's reorganize it. How?
  * Create a new folder named playwright
  * Move the generated 'test' folder inside of the new 'playwright' folder.
  * In your playwright.config.ts, change the testDir to ```testDir: './playwright/tests',```

3- Is it working? Let's test it out: 
  * Run the command: ``` pnpm exec playwright test ```

4- You should get a message confirming that Playwright was executed: 
```
Running 6 tests using 4 workers
  6 passed (11.3s) ~ Something similar
```

## How to map web locators using XPath and CSS? 
How you can interact with web elements using Playwright? Playwright recommends some [built in locators](https://playwright.dev/docs/locators) that I recommend to use, if your project allows you to use them. However, you can also use the following strategies: 
- [CSS Locators - Full Guideline](https://youtu.be/_7bPbDAz-qg?si=ZqNNhTkyTMAH7SB6)
- [XPath Locators - Full Guideline](https://youtu.be/XyBxEnyBb0A?si=psy6xm-yn_hGeoiT)
