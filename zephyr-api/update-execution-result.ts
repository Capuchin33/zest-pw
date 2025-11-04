import { getResultsFromJson } from './get-results-from-json';
import { 
    getTestCaseId, 
    getTestExecutionKey, 
    putTestExecution 
} from './zephyr-api';

/**
 * Updates test execution results in Zephyr Scale
 * Reads test results from JSON file and updates each test case in Zephyr
 */
export async function updateTestResult() {
    console.log('Updating test result in Zephyr...');
    
    const testResults = await getResultsFromJson();
    if (!testResults) {
        console.error('No test results found');
        return;
    }
    
    for (const testCaseKey in testResults) {
        const steps = testResults[testCaseKey];
        const testCaseId = await getTestCaseId(testCaseKey);
        
        if (!testCaseId) {
            console.warn(`Test case ID not found for key: ${testCaseKey}`);
            continue;
        }
        
        const testExecutionKey = await getTestExecutionKey(testCaseId);

        if (testExecutionKey) {
            await putTestExecution(testExecutionKey, steps);
        }
    }
}