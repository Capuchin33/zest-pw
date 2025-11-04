import type { TestInfo, TestType, Page } from '@playwright/test';
import { takeScreenshotAfterStep } from './take-screenshots';

/**
 * Wraps test.step to automatically create screenshots after each test step
 * @param test - Playwright test object
 * @param getCurrentContext - Function to get current test context (testInfo and page)
 */
export function wrapTestStepWithScreenshots(
  test: TestType<any, any>,
  getCurrentContext: () => { testInfo: TestInfo; page: Page } | null
): void {
  const originalTestStep = test.step.bind(test);
  const originalTestStepSkip = (test.step as any).skip?.bind(test);

  const stepWrapper = async function<T>(
    title: string,
    body: (stepInfo: any) => Promise<T> | T,
    options?: { box?: boolean; timeout?: number }
  ): Promise<T> {
    return originalTestStep(title, async (stepInfo: any) => {
      try {
        const result = await body(stepInfo);
        
        const context = getCurrentContext();
        if (context?.page && context?.testInfo) {
          await takeScreenshotAfterStep(context.page, stepInfo, context.testInfo, title);
        }
        
        return result;
      } catch (error) {
        const context = getCurrentContext();
        if (context?.page && context?.testInfo) {
          try {
            await takeScreenshotAfterStep(context.page, { ...stepInfo, error }, context.testInfo, title);
          } catch (screenshotError) {
            console.error('Error taking screenshot after step error:', screenshotError);
          }
        }
        throw error;
      }
    }, options);
  };

  if (originalTestStepSkip) {
    (stepWrapper as any).skip = originalTestStepSkip;
  }

  test.step = stepWrapper as any;
}

