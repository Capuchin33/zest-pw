import { test as base, Page, TestInfo } from '@playwright/test';
import { wrapTestStepWithScreenshots } from '../utils/test-step-wrapper';

let currentTestContext: { testInfo: TestInfo; page: Page } | null = null;

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    currentTestContext = { testInfo, page };

    await use(page);
    
    currentTestContext = null;
  },
});

// Apply wrapper to test.step for automatic screenshots
wrapTestStepWithScreenshots(test, () => currentTestContext);

export { expect } from '@playwright/test';

