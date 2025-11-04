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
    printTestInfo(test);
    
    const allSteps = test.steps || [];
    const executedSteps = allSteps.filter((step: any) => step.statusName !== 'In Progress');
    
    const testFileName = test.testCaseKey || 'test';
    const sanitizedTitle = test.testTitle.replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
    const projectName = test.projectName || 'chromium';
    const outputDir = path.join('test-results', `${testFileName}-${sanitizedTitle}-${projectName}`);
    
    printTestSteps(executedSteps.length, allSteps, test.testTitle, outputDir);
  });

}

/**
 * Prints general test information
 * @param test - Test object containing testCaseKey and testTitle
 */
function printTestInfo(test: any): void {
  console.log(`\n${test.testCaseKey}: ${test.testTitle}`);
}

/**
 * Prints test step information
 * @param executedCount - Number of executed steps
 * @param allSteps - Array of all steps (executed and planned)
 * @param testTitle - Title of the test
 * @param outputDir - Optional output directory path for saving screenshots
 */
function printTestSteps(executedCount: number, allSteps: any[], testTitle: string, outputDir?: string): void {
  if (allSteps.length === 0) {
    console.log('  Steps: none');
    return;
  }

  const totalCount = allSteps.length;
  console.log(`  Steps (${executedCount}/${totalCount}):`);

  allSteps.forEach((step: any, stepIndex: number) => {
    const statusEmoji = step.statusName === 'passed' ? 'passed - ✅' : step.statusName === 'failed' ? 'failed - ❌' : step.statusName === 'In Progress' ? 'skipped - ⏭️' : '⏱️';
    console.log(`    ${stepIndex + 1}. ${step.stepTitle}`);
    
    if (step.error) {
      console.log(`       ❌ Error: ${step.error.message}`);
      if (step.error.stack) {
        const stackLines = step.error.stack.split('\n').slice(0, 3);
        stackLines.forEach((line: string) => console.log(`          ${line}`));
      }
    }
    
    printStepAttachments(step, testTitle, outputDir, stepIndex + 1);
    console.log(`       Status: ${statusEmoji}`);
    
    console.log('');
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

  console.log(`       Screenshot:`);
  step.actualResult.forEach((att: any) => {
    const isErrorScreenshot = att.fileName?.includes('ERROR');
    const emoji = isErrorScreenshot ? '💥' : att.image === 'image/png' ? '📸' : '📄';
    
    const displayName = att.image === 'image/png' ? 'Decode: Base64' : att.fileName;
    console.log(`         ${emoji} ${displayName}`);
    
    if (att.body && att.image === 'text/plain') {
      console.log(`         ${att.body}`);
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
        
        console.log(`         💾 File saved: locally`);
        console.log(`         📄 File name: ${filename}`);
      } catch (error) {
        console.error(`         ⚠️  Error saving screenshot: ${error}`);
      }
    }
  });
}
