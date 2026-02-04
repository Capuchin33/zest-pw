import type { TestInfo, Page, TestStepInfo, test as base, Location } from '@playwright/test';
import { takeScreenshotAfterStep } from './take-screenshots';

/**
 * Wraps test.step to automatically create screenshots after each test step
 * @param test - Playwright test object
 * @param getCurrentContext - Function to get current test context (testInfo and page)
 */
export function wrapTestStepWithScreenshots(
  test: typeof base,
  getCurrentContext: () => { testInfo: TestInfo; page: Page } | null
): void {
  const originalTestStep: typeof test.step = test.step.bind(test);
  const originalTestStepSkip = test.step.skip.bind(test);

  const takeScreenshot = async (title: string, hasError: boolean = false) => {
    const context = getCurrentContext();
    try {
      await takeScreenshotAfterStep(context.page, context.testInfo, title, hasError);
    } catch (screenshotError) {
      console.error('Error taking screenshot after step error:', screenshotError);
    }
  }

  const stepWrapper: typeof test.step = async function<T>(
    title: string,
    body: (stepInfo: TestStepInfo) => Promise<T> | T,
    options?: { box?: boolean; location?: Location; timeout?: number }
  ): Promise<T> {
    return originalTestStep(title, async (stepInfo: TestStepInfo) => {
      try {
        const result = await body(stepInfo);
        await takeScreenshot(title, false);
        return result;
      } catch (error) {
        await takeScreenshot(title, true);
        throw error;
      }
    }, options);
  };

  if (originalTestStepSkip) {
    stepWrapper.skip = originalTestStepSkip;
  }

  test.step = stepWrapper;
}

