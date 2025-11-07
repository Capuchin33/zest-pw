import * as fs from 'fs';
import * as path from 'path';
import { getZestConfig } from '../config';

/**
 * Decodes base64 string to Buffer
 * @param base64String - Base64 encoded string
 * @returns Buffer containing decoded data
 */
function decodeBase64ToBuffer(base64String: string): Buffer {
  return Buffer.from(base64String, 'base64');
}

/**
 * Saves screenshot from base64 string to file
 * @param base64String - Base64 encoded screenshot string
 * @param filename - File name for the screenshot
 * @param outputDir - Base output directory (default 'screenshots')
 * @param testTitle - Optional test title, creates subdirectory for organization
 * @returns Full path to the saved screenshot file
 */
export function saveBase64Screenshot(
  base64String: string,
  filename: string,
  outputDir: string = 'screenshots',
  testTitle?: string
): string {
  let screenshotsPath = path.join(process.cwd(), outputDir);
  
  if (testTitle) {
    const safeTestTitle = testTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    screenshotsPath = path.join(screenshotsPath, safeTestTitle);
  }
  
  if (!fs.existsSync(screenshotsPath)) {
    fs.mkdirSync(screenshotsPath, { recursive: true });
  }

  const filepath = path.join(screenshotsPath, filename);
  const buffer = decodeBase64ToBuffer(base64String);
  fs.writeFileSync(filepath, buffer);

  return filepath;
}

/**
 * Saves all screenshots from test results to disk
 * @param result - Test results object containing tests array with steps and actualResult attachments
 */
export function saveScreenshotToDisk(result: any): void {
  result.tests.forEach((test) => {
      const allSteps = test.steps || [];
      const testFileName = test.testCaseKey || 'test';
      const sanitizedTitle = test.testTitle.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
      const projectName = test.projectName || 'chromium';
      const outputDir = path.join('test-results', `${testFileName}-${sanitizedTitle}-${projectName}`);

      const actualResult = allSteps.map((test) => test.actualResult);

      actualResult.forEach((att) => {
          try {
          const filename = att[0].fileName;
          const body = att[0].body;
              if (outputDir) {
                  saveBase64Screenshot(body, filename, outputDir);
              } else {
                  saveBase64Screenshot(body, filename,);
              }
          } catch (error) {
              console.error(`   ⚠️  Error saving screenshot: ${error}`);
          }
      });
  });
}