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
    const executedSteps = allSteps.filter((step: any) => step.statusName !== 'In Progress');
    
    const testFileName = test.testCaseKey || 'test';
    const sanitizedTitle = test.testTitle.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
    const projectName = test.projectName || 'chromium';
    const outputDir = path.join('test-results', `${testFileName}-${sanitizedTitle}-${projectName}`);
    console.log('');
    console.log('');
    console.log(`\x1b[30m––––––––––––––––––––––––––––––––––\x1b[0m ${test.testCaseKey} \x1b[30m––––––––––––––––––––––––––––––––––\x1b[0m`);
    printTestInfo(test);
    printTestSteps(executedSteps.length, allSteps, test.testTitle, outputDir);
    console.log('');
  });

}

/**
 * Prints general test information
 * @param test - Test object containing testCaseKey and testTitle
 */
function printTestInfo(test: any): void {
  console.log(`\n\x1b[30mTEST CASE:\x1b[0m ${test.testTitle}`);
}

/**
 * Prints test step information
 * @param executedCount - Number of executed steps
 * @param allSteps - Array of all steps (executed and planned)
 * @param testTitle - Title of the test
 * @param outputDir - Optional output directory path for saving screenshots
 */
function printTestSteps(executedCount: number, allSteps: any[], testTitle: string, outputDir?: string): void {

  const totalCount = allSteps.length;
  console.log('');
  allSteps.forEach((step: any, stepIndex: number) => {
    const statusEmoji = step.statusName === 'pass' ? '\x1b[32mPASSED ✓\x1b[0m' : step.statusName === 'fail' ? '\x1b[31mFAILED ✗\x1b[0m' : step.statusName === 'In Progress' ? '\x1b[30mSKIPPED ⊘\x1b[0m' : '⏱️';
    if (step.error) {
        console.log('\x1b[31m- - - - - - - - - - - - -  ERROR  - - - - - - - - - - - - -\x1b[0m');
        console.log('');
    }    
    console.log(`\x1b[30mTest Step ${stepIndex + 1}:\x1b[0m ${step.stepTitle}`);
    printStepAttachments(step, testTitle, outputDir, stepIndex + 1);
    console.log('');
    console.log(`\x1b[30mstatus:\x1b[0m ${statusEmoji}\x1b[0m`);
    console.log('');
    if (step.error) {
      const stackLines = step.error.message.split('\n').slice(0, 4);
      stackLines.forEach((line: string) => console.log(`${line}`));
      console.log('');
      console.log('\x1b[31m- - - - - - - - - - - - -  ERROR  - - - - - - - - - - - - -\x1b[0m');
      console.log('');
  }
  });
  console.log('');
  console.log(`\x1b[30mTotal results:\x1b[0m \x1b[32m${executedCount} passed,\x1b[0m \x1b[31m${totalCount - executedCount} failed\x1b[0m`);
  console.log('');
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

  console.log(`\x1b[30mScreenshot:\x1b[0m`);
  step.actualResult.forEach((att: any) => {
    const isErrorScreenshot = att.fileName?.includes('ERROR');
    const emoji = isErrorScreenshot ? '💥' : att.image === 'image/png' ? '📸' : '📄';
    
    const displayName = att.image === 'image/png' ? '\x1b[30mDecode:\x1b[0m Base64' : att.fileName;
    console.log(`   ${emoji} ${displayName}`);
    
    if (att.body && att.image === 'text/plain') {
      console.log(`${att.body}`);
    }
    
    const config = getZestConfig();
    const shouldSaveScreenshots = config.screenshots.saveToDisk || process.env.SAVE_SCREENSHOTS === 'true';
    
    if (att.body && shouldSaveScreenshots && att.image === 'image/png') {
      try {
        const filename = att.fileName;
        
        if (outputDir) {
          saveBase64Screenshot(att.body, filename, outputDir);
        } else {
          saveBase64Screenshot(att.body, filename, 'screenshots', testTitle);
        }
        
        console.log(`   \x1b[30m💾 File saved:\x1b[0m locally`);
        console.log(`   \x1b[30m📄 File name:\x1b[0m ${filename}`);
      } catch (error) {
        console.error(`   ⚠️  Error saving screenshot: ${error}`);
      }
    }
  });
}
