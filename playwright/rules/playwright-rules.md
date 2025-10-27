# Playwright Testing Framework Rules & Guidelines

## MANDATORY STRUCTURAL PATTERNS

### 1. Page Object Model (POM) Implementation
- **REQUIREMENT**: All page interactions MUST be encapsulated in Page Object classes
- **LOCATION**: Store all page classes in `/playwright/pages/` directory
- **NAMING**: Use PascalCase with descriptive names ending in "Page" (e.g., `LoginPage`, `CheckoutPage`)
- **STRUCTURE**: Each page class MUST follow this exact pattern:

```typescript
import { Page, Locator, test } from '@playwright/test';

export class [PageName]Page {
    readonly page: Page;
    readonly [elementName]: Locator;
    readonly url: string = '/path';

    constructor(page: Page) {
        this.page = page;
        this.elementName = page.locator('selector').describe('description');
    }

    async load() {
        await test.step('Load [page] page', async () => {
            await this.page.goto(this.url);
        });
    }

    async waitLoad() {
        await test.step('Wait for [page] page to load', async () => {
            await this.[keyElement].waitFor({ state: 'visible' });
        });
    }
}
```

### 2. Fixture Pattern for Dependency Injection
- **REQUIREMENT**: ALL page objects MUST be injected via fixtures, never instantiated directly in tests
- **LOCATION**: Define fixtures in `/playwright/fixtures/page.fixtures.ts`
- **PATTERN**: Each page object must have a corresponding fixture:

```typescript
export const pageFixture = base.extend<PageFixture>({
    [pageName]Page: async ({ page }, use) => {
        await use(new [PageName]Page(page));
    },
});
```

- **IMPORT**: Tests must import from consolidated fixtures: `import { test, expect } from '@/playwright/fixtures/index.fixtures';`

### 3. E2E Workflow Pattern
- **REQUIREMENT**: Complex multi-page workflows MUST use the E2E utility class
- **LOCATION**: `/playwright/utils/e2e.ts`
- **PURPOSE**: Encapsulate complete user journeys that span multiple pages
- **USAGE**: Inject via e2eFixture, access methods like `await e2e.processAPayment(username, password)`

### 4. Test Step Wrapping (MANDATORY)
- **REQUIREMENT**: ALL actions in page objects MUST be wrapped in `test.step()`
- **FORMAT**: `await test.step('Clear description of action', async () => { /* action */ });`
- **BENEFIT**: Provides detailed test execution reporting and debugging

### 5. Data Management Strategy
- **TEST DATA**: Store in `/playwright/data/` directory as JSON files
- **ASSERTIONS**: Use `/playwright/data/assertions.json` for expected text/values
- **SECRETS**: Use environment variables for credentials (NEVER hardcode)
- **PAYMENT INFO**: Centralize in `/playwright/data/payment-information.json`

## FILE ORGANIZATION RULES

### Directory Structure (MANDATORY)
```
playwright/
├── data/                    # JSON files for test data
│   ├── assertions.json      # Expected text values
│   └── payment-information.json
├── fixtures/                # Playwright fixtures
│   ├── index.fixtures.ts    # Consolidated export
│   ├── page.fixtures.ts     # Page object fixtures
│   └── e2e.fixtures.ts      # E2E workflow fixtures
├── pages/                   # Page Object Model classes
│   ├── login.ts
│   ├── products.ts
│   ├── cart.ts
│   └── checkout.ts
├── tests/                   # Test specification files
├── types/                   # TypeScript type definitions
└── utils/                   # Utility classes (E2E workflows)
```

### Naming Conventions
- **Files**: Use kebab-case for test files (e.g., `payment-workflows.spec.ts`)
- **Classes**: PascalCase (e.g., `LoginPage`, `E2E`)
- **Methods**: camelCase with descriptive action names
- **Locators**: camelCase describing the element (e.g., `signInBtn`, `cardNumberInput`)

## LOCATOR STRATEGY

### Required Locator Practices
1. **PREFER**: `data-testid` attributes for reliable element targeting
2. **SECONDARY**: Role-based selectors (`page.getByRole('button', { name: 'Sign In' })`)
3. **AVOID**: CSS selectors based on styling classes
4. **MANDATORY**: Add `.describe()` to all locators for better debugging

### Locator Examples
```typescript
// Preferred (data-testid)
this.cardNumberInput = page.locator('input[data-testid="card-number-input"]');

// Acceptable (role-based)
this.signInBtn = page.getByRole('button', { name: 'Sign In' }).describe('sign in button');

// With description (MANDATORY)
this.errorContainer = page.locator('[data-testid="login-error"]').describe('error container');
```

## TEST ORGANIZATION

### Test File Structure (MANDATORY)
```typescript
import { test, expect } from '@/playwright/fixtures/index.fixtures';
import 'dotenv/config';

const secrets: NodeJS.ProcessEnv = process.env;

test.describe('Feature Name', () => {
    test('should perform specific action', async ({ pageName, anotherPage }) => {
        // Test implementation with proper step wrapping
    });
});
```

### Test Writing Rules
1. **DESCRIBE BLOCKS**: Group related functionality
2. **TEST NAMES**: Use descriptive "should" statements
3. **ENVIRONMENT**: Always import 'dotenv/config' for environment variables
4. **SECRETS**: Access via `process.env` object typed as `NodeJS.ProcessEnv`

## CONFIGURATION REQUIREMENTS

### Playwright Config (playwright.config.ts)
- **BASE URL**: Must be set to `http://localhost:3001`
- **TEST DIR**: Must point to `./playwright/tests`
- **BROWSERS**: Support Chromium, Firefox, WebKit
- **WEB SERVER**: Auto-start with `PORT=3001 npm run dev`
- **REPORTERS**: HTML for local, multiple reporters for CI

### Environment Variables (MANDATORY)
- `SUCCESSFUL_USERNAME`: Valid login credentials
- `SUCCESSFUL_PASSWORD`: Valid login credentials  
- `FAIL_USERNAME`: Credentials that trigger payment failure
- `FAIL_PASSWORD`: Credentials that trigger payment failure

## CODE QUALITY STANDARDS

### TypeScript Requirements
- **TYPES**: Define custom types in `/playwright/types/index.ts`
- **STRICT**: All code must pass TypeScript strict mode
- **IMPORTS**: Use path aliases (`@/playwright/...`, `@pages/...`)

### Error Handling
- **WAITS**: Always use explicit waits (`waitFor({ state: 'visible' })`)
- **ASSERTIONS**: Use Playwright's built-in expect assertions
- **TIMEOUTS**: Rely on Playwright's default timeouts, extend only when necessary


## WORKFLOW PATTERNS

### Authentication Pattern
```typescript
await test.step('Login and wait for products page', async () => {
    await loginPage.load();
    await loginPage.waitLoad();
    await loginPage.submitSignInForm(secrets.SUCCESSFUL_USERNAME, secrets.SUCCESSFUL_PASSWORD);
    await productsPage.waitLoad();
});
```

### Navigation Pattern
```typescript
await test.step('Navigate to cart', async () => {
    await headerPage.clickCartLink();
    await expect(cartPage.page).toHaveURL(cartPage.url);
});
```

### Form Filling Pattern
```typescript
async fillShippingForm(name: string, email: string, address: string) {
    await test.step('Filling the shipping form', async () => {
        await this.nameInput.fill(name);
        await this.emailInput.fill(email);
        await this.addressInput.fill(address);
        await this.continueButton.click();
    });
}
```

## EXISTING APPLICATION CONTEXT

### Current Application Pages & Page Objects
The application contains the following pages with their corresponding Playwright page object status:

**Implemented Page Objects** (in `/playwright/pages/`):
- `LoginPage` (`login.ts`) → `/login` route
- `ProductsPage` (`products.ts`) → `/products` route  
- `CartPage` (`cart.ts`) → `/cart` route
- `CheckoutPage` (`checkout.ts`) → `/checkout` route
- `HeaderPage` (`header.ts`) → Navigation component

**Application Pages Without Page Objects** (in `/app/`):
- **Orders Page** (`/orders`) → Displays order history, similar to cart functionality
- **Root Page** (`/`) → Home/landing page

### Pre-Implementation Analysis (MANDATORY)
Before creating ANY new page object, you MUST:

1. **AUDIT EXISTING**: Review all page objects in `/playwright/pages/` directory
2. **CHECK SIMILARITY**: Identify if similar functionality already exists
   - Example: Orders page functionality overlaps with Cart page (both handle items, totals, navigation)
   - Example: Different checkout steps might reuse existing CheckoutPage methods
3. **EVALUATE REUSE**: Determine if existing page objects can be extended rather than duplicated
4. **ASSESS COMPLETENESS**: Check if existing page objects have missing methods that your test needs

### Functionality Overlap Examples
- **Orders & Cart**: Both display items, prices, totals, and navigation to other pages
- **Login & Checkout**: Both may have form validation and error handling patterns
- **Products & Orders**: Both may have "add to cart" or "buy again" functionality
- **Header Navigation**: Shared across all pages, centralized in HeaderPage

### Implementation Status Assumptions (CRITICAL)
**DO NOT ASSUME** that all page objects are fully implemented:
- Some page objects may be missing essential methods (`load()`, `waitLoad()`)
- Locators might be incomplete or need additional elements
- Page objects may not cover all functionality available on the actual page
- Always verify current implementation before building upon it

**VALIDATION PROCESS**:
1. Read the existing page object file completely
2. Compare against the actual application page requirements
3. Identify missing methods, locators, or functionality
4. Extend existing page objects rather than creating duplicates

## AGENT IMPLEMENTATION GUIDELINES

### When Adding New Tests:
1. **AUDIT FIRST**: Check existing page objects for similar functionality (MANDATORY)
2. **IDENTIFY GAPS**: Determine if new page objects are truly needed or if existing ones can be extended
3. **REUSE PATTERNS**: Extend existing page classes when functionality overlaps
4. **CREATE NEW**: Only create new page objects when functionality is genuinely unique
5. **FIXTURE**: Register new/modified page objects in page.fixtures.ts
6. **DATA**: Add any new test data to appropriate JSON files
7. **WORKFLOW**: Consider if E2E class needs new methods

### When Modifying Existing Tests:
1. **AUDIT EXISTING**: Always check what methods/locators already exist before adding new ones
2. **PRESERVE**: Maintain existing fixture patterns
3. **EXTEND**: Add new locators following naming conventions, avoid duplication
4. **STEP**: Wrap all new actions in test.step()
5. **DESCRIBE**: Add descriptions to new locators

### Error Resolution Priority:
1. Check locator selectors (prefer data-testid)
2. Verify page object fixture registration
3. Ensure proper import paths
4. Validate environment variables
5. Check test.step() wrapping

## CRITICAL SUCCESS FACTORS

### Must-Follow Rules for Agent Success:
1. **ALWAYS** audit existing page objects before creating new ones
2. **NEVER** duplicate functionality that already exists in other page objects
3. **NEVER** instantiate page objects directly in tests
4. **ALWAYS** use fixture injection pattern
5. **NEVER** hardcode test data in test files
6. **ALWAYS** wrap actions in test.step()
7. **NEVER** use unreliable selectors (avoid CSS classes)
8. **ALWAYS** add .describe() to locators
9. **NEVER** skip environment variable setup
10. **ALWAYS** follow the established directory structure

### Quality Checkpoints:
- [ ] Existing page objects audited before creating new ones
- [ ] No duplicate functionality across page objects
- [ ] All page interactions use Page Object Model
- [ ] All page objects are injected via fixtures
- [ ] All actions wrapped in test.step()
- [ ] All locators have descriptions
- [ ] Test data externalized to JSON files
- [ ] Environment variables properly configured
- [ ] TypeScript types defined for custom objects
- [ ] Import paths use aliases correctly

This framework emphasizes maintainability, readability, and scalability. Adherence to these patterns ensures consistent, reliable, and debuggable test automation.