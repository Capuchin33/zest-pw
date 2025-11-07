import * as path from 'path';
import { saveBase64Screenshot } from './save-screenshots';
import { getZestConfig } from '../config';

/**
 * Formats and prints test results after completion
 * Expects result to be enriched with planned steps via enrichTestResultsWithPlannedSteps
 * @param result - Test results object containing tests array with steps information
 */
export function printTestResults(result: any): void {

  if (!result.tests || !Array.isArray(result.tests)) {
    return;
  }
  
  result.tests.forEach((test: any) => {    
    const allSteps = test.steps || [];
    const testFileName = test.testCaseKey || 'test';
    const sanitizedTitle = test.testTitle.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
    const projectName = test.projectName || 'chromium';
    const outputDir = path.join('test-results', `${testFileName}-${sanitizedTitle}-${projectName}`);
    const testTitle = `${projectName} › ${testFileName} › ${test.testTitle}`
    const remainder = (63 - testTitle.length) < 0 ? 0 : (63 - testTitle.length);
    const spaces = '\x1b[40m \x1b[0m'.repeat(remainder);
    console.log(`\n\x1b[40m${testTitle}${spaces}\x1b[0m`);
    printTestSteps(allSteps, test.testTitle, outputDir);
  });

  let passedCount = 0;
  let failedCount = 0;
  let skippedCount = 0;

  result.tests.forEach((test) => {
      for (const step of test.steps) {
        switch (step.statusName) {
          case 'pass': passedCount++; 
          break;
          case 'fail': failedCount++; 
          break;
          case 'In Progress': skippedCount++; 
          break;
        }
      }
  });
  console.log(`\x1b[30mTotal results:\x1b[0m \x1b[32m${passedCount} passed\x1b[0m\x1b[30m,\x1b[0m \x1b[31m${failedCount} failed\x1b[0m\x1b[30m,\x1b[0m \x1b[30m${skippedCount} skipped\x1b[0m`);
  console.log('\n');
}

/**
 * Prints test step information
 * @param allSteps - Array of all steps (executed and planned)
 * @param testTitle - Title of the test
 * @param outputDir - Optional output directory path for saving screenshots
 */
function printTestSteps(allSteps: any[], testTitle: string, outputDir?: string): void {
  console.log('');
  allSteps.forEach((step: any, stepIndex: number) => {
    if (step.statusName === 'In Progress') {
      return;
    }
    let stepTitle: string;
    switch (step.statusName) {
        case 'fail': stepTitle = `\x1b[31m${step.stepTitle}\x1b[0m`;
        break;
        default: stepTitle = step.stepTitle;
        break;
    }
    const statusEmoji = step.statusName === 'pass' ? '\x1b[32mPASSED ✓\x1b[0m' : step.statusName === 'fail' ? '\x1b[31mFAILED ✗\x1b[0m' : step.statusName === 'In Progress' ? '\x1b[30mSKIPPED ⊘\x1b[0m' : '⏱️';
    console.log(`\x1b[30mSTEP ${stepIndex + 1}:\x1b[0m ${stepTitle}`);
    printStepAttachments(step, testTitle, outputDir, stepIndex + 1);
    if (step.error) {
      const stackLines = step.error.message.split('\n').slice(0, 4);
      console.log('\n\n\x1b[41m                             ERROR                             \x1b[0m\n');
      stackLines.forEach((line) => console.log(`${line}`));
      console.log('\n\x1b[41m                             ERROR                             \x1b[0m\n\n');
    };
    if (!step.error) {
    console.log(`\n\x1b[30mstatus:\x1b[0m ${statusEmoji}\x1b[0m`);
    console.log('\x1b[30m‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾ ‾\x1b[0m\n\n');
    };
  });
}
/**
 * Prints step attachments (screenshots, etc.)
 * @param step - Step object containing actualResult with attachments
 * @param testTitle - Title of the test
 * @param outputDir - Optional output directory path for saving screenshots
 * @param _stepNumber - Step number (unused, kept for compatibility)
 */
function printStepAttachments(step: any, testTitle: string, outputDir: string | undefined, _stepNumber: number): void {
  if (!step.actualResult || step.actualResult.length === 0) {
    return;
  }

  console.log(`\x1b[30mscreenshot:\x1b[0m`);
  step.actualResult.forEach((att: any) => {
    const displayName = att.image === 'image/png' ? '\x1b[30m-decode:\x1b[0m Base64' : att.fileName;
    console.log(`    ${displayName}`);
        
    const config = getZestConfig();
    const shouldSaveScreenshots = config.screenshots.saveToDisk || process.env.SAVE_SCREENSHOTS === 'true';
    
    if (att.body && shouldSaveScreenshots) {
      try {
        const filename = att.fileName;

        console.log(`   \x1b[30m -saved:\x1b[0m Locally`);
        console.log(`   \x1b[30m -name:\x1b[0m ${filename}`);
      } catch (error) {
        console.error(`   ⚠️  Error saving screenshot: ${error}`);
      }
    }
  });
}
