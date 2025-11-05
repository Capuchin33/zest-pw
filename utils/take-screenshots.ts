/**
 * Utility for creating screenshots after test steps
 */

import type { Page, TestInfo } from "@playwright/test";

/**
 * Takes a screenshot after each test step (always, regardless of result)
 * 
 * To save screenshots to disk (from base64 results):
 * 1. Add to .env file: SAVE_SCREENSHOTS=true
 * 2. Or pass via command: SAVE_SCREENSHOTS=true npx playwright test
 * 
 * @param page - Playwright Page object
 * @param stepInfo - Step information object
 * @param testInfo - Playwright TestInfo object for attaching screenshots
 * @param stepTitle - Optional step title for attachment name
 */
export async function takeScreenshotAfterStep(
  page: Page,
  testInfo: TestInfo,
  stepTitle?: string
): Promise<void> {
  try {
    if (page && testInfo) {
      const screenshotBuffer = await page.screenshot({ fullPage: true });
      
      await testInfo.attach(stepTitle || 'screenshot', {
        body: screenshotBuffer,
        contentType: 'image/png',
      });
    }
  } catch (error) {
    console.error('Error taking step screenshot:', error);
  }
}
