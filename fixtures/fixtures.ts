import { test as base, Page, TestInfo } from '@playwright/test';
import { wrapTestStepWithScreenshots } from '../utils/test-step-wrapper';

let currentTestContext: { testInfo: TestInfo; page: Page } | null = null;
const screenshotWrapperApplied = Symbol('zestScreenshotWrapperApplied');

function enableStepScreenshots<T extends typeof base>(targetTest: T): T {
  const testWithMeta = targetTest as T & { [screenshotWrapperApplied]?: boolean };

  if (testWithMeta[screenshotWrapperApplied]) {
    return targetTest;
  }

  wrapTestStepWithScreenshots(targetTest, () => currentTestContext);
  testWithMeta[screenshotWrapperApplied] = true;

  const originalExtend = targetTest.extend.bind(targetTest);
  targetTest.extend = ((...args: unknown[]) => {
    const extendedTest = originalExtend(...args as Parameters<typeof originalExtend>);
    return enableStepScreenshots(extendedTest);
  }) as typeof targetTest.extend;

  return targetTest;
}

const zestBaseTest = base.extend({
  page: async ({ page }, use, testInfo) => {
    currentTestContext = { testInfo, page };

    await use(page);
    
    currentTestContext = null;
  },
});

export const test = enableStepScreenshots(zestBaseTest);

export { expect } from '@playwright/test';

