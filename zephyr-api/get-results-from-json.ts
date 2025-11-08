import * as fs from 'fs';
import * as path from 'path';

/**
 * Helper function to read test results from JSON file
 * @returns Test results object or null if file doesn't exist
 */
function readTestResults() {
    const testResultsPath = path.join(process.cwd(), 'test-results', 'test-results.json');
    
    if (!fs.existsSync(testResultsPath)) {
        console.error('Test results file not found:', testResultsPath);
        return null;
    }
    
    const testResultsContent = fs.readFileSync(testResultsPath, 'utf-8');
    const testResults = JSON.parse(testResultsContent);
    
    return testResults;
}

/**
 * Gets test results from JSON file and processes them for Zephyr
 * Excludes testTitle and testCaseKey from each test, stepTitle from each step,
 * and transforms tests array into an object with testCaseKey as keys
 * @returns Processed test results object with testCaseKey as keys, or null if no results found
 */
export async function getResultsFromJson() {
    console.log('Getting results for Zephyr...');
    
    const testResults = readTestResults();
    
    if (!testResults) {
        console.error('No test results found');
        return null;
    }
    
    const processedResults = testResults.tests.reduce((acc, test) => {
        const { projectName, testTitle, testCaseKey, ...testData } = test;
        acc[testCaseKey] = {
            ...testData,
            steps: test.steps.map(({ stepTitle, actualResult, ...step }) => {
                let processedActualResult = actualResult;
                if (actualResult && Array.isArray(actualResult)) {
                    processedActualResult = actualResult.map(item => {
                        return `<img src="data:${item.image || ''};base64,${item.body || ''}" alt="${item.fileName || ''}">`;
                    }).join('');
                }
                return {
                    actualResult: processedActualResult,
                    ...step
                };
            })
        };
        return acc;
    }, {});
    
    return processedResults;
}

