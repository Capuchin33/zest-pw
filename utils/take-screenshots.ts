/**
 * Utility for creating screenshots after test steps
 */

import type { Page, TestInfo } from "@playwright/test";
import { getZestConfig } from "../config";

/**
 * Takes a screenshot after each test step
 * 
 * Screenshot behavior is controlled by configuration:
 * - screenshots.enabled: If false, no screenshots are taken
 * - screenshots.onlyOnFailure: If true, screenshots are only taken when step fails
 * - screenshots.fullPage: Controls whether to capture full page or viewport only
 * 
 * To save screenshots to disk (from base64 results):
 * 1. Add to .env file: SAVE_SCREENSHOTS=true
 * 2. Or pass via command: SAVE_SCREENSHOTS=true npx playwright test
 * 3. Or set screenshots.saveToDisk: true in config
 * 
 * @param page - Playwright Page object
 * @param testInfo - Playwright TestInfo object for attaching screenshots
 * @param stepTitle - Optional step title for attachment name
 * @param hasError - Whether the step failed (used for onlyOnFailure logic)
 */
export async function takeScreenshotAfterStep(
  page: Page,
  testInfo: TestInfo,
  stepTitle?: string,
  hasError?: boolean
): Promise<void> {
  try {
    if (page && testInfo) {
      const config = getZestConfig();
      
      // Check if screenshots are enabled
      if (!config.screenshots.enabled) {
        return;
      }
      
      // Check if we should only take screenshots on failure
      // If onlyOnFailure is true, only take screenshot when hasError is explicitly true
      if (config.screenshots.onlyOnFailure && !hasError) {
        return;
      }
      
      const screenshotBuffer = await page.screenshot({ 
        fullPage: config.screenshots.fullPage 
      });
      
      await testInfo.attach(stepTitle || 'screenshot', {
        body: screenshotBuffer,
        contentType: 'image/png',
      });
    }
  } catch (error) {
    console.error('Error taking step screenshot:', error);
  }
}
