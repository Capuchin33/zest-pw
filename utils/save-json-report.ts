import * as fs from 'fs';
import * as path from 'path';

/**
 * Saves test results to JSON file
 * 
 * This function creates a JSON report from test results and saves it to the specified directory.
 * If the directory doesn't exist, it will be created automatically.
 * 
 * @param result - Object with test results to be saved
 * @param outputDir - Directory for saving (default 'test-results')
 * @returns Full path to the saved JSON file
 * @throws Error if file cannot be saved
 * 
 * @example
 * const filepath = saveTestResultsToJson(testResults);
 * console.log(`Saved to: ${filepath}`);
 */
export function saveTestResultsToJson(result: any, outputDir: string = 'test-results'): string {
  try {
    const resultsPath = path.join(process.cwd(), outputDir);
    
    if (!fs.existsSync(resultsPath)) {
      fs.mkdirSync(resultsPath, { recursive: true });
    }

    const filename = `test-results.json`;
    const filepath = path.join(resultsPath, filename);
    fs.writeFileSync(filepath, JSON.stringify(result, null, 2), 'utf-8');
    
    return filepath;
  } catch (error) {
    console.error(`\n⚠️  Error saving JSON report: ${error}`);
    throw error;
  }
}

