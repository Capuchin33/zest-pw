/**
 * Gets common headers for all Zephyr API requests
 * @returns Headers object with Content-Type and Authorization
 */
const getHeaders = () => {
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.ZEPHYR_API_KEY}`
    };
}

/**
 * Gets test case ID from Zephyr by its key
 * @param testCaseKey - Test case key (e.g., "TC-001")
 * @returns Test case ID or undefined in case of error
 */
export async function getTestCaseId(testCaseKey: string) {
    try {
        const response = await fetch(process.env.ZEPHYR_API_URL + 'testcases/' + testCaseKey,
            {
                method: 'GET',
                headers: getHeaders(),
            }
        );
        const data = await response.json() as { id: string };
        const id = data.id;
        console.log('------------------------------------------');
        console.log('Test case key:', testCaseKey);
        return id;
    }
    catch (error) {
        console.error('Error getting test case ID:', error);
        return undefined;
    }
}

/**
 * Gets test execution key from Zephyr by test case ID
 * @param testCaseId - Test case ID
 * @returns Test execution key or null in case of error
 */
export async function getTestExecutionKey(testCaseId: string) {
    try {
        const response = await fetch(process.env.ZEPHYR_API_URL + 'testexecutions' + '?testCycle=' + process.env.ZEPHYR_TEST_CYCLE_KEY + '&maxResults=1000',
            {
                method: 'GET',
                headers: getHeaders()
            }
        );

        const data = await response.json() as { values: Array<{ key: string; testCase: { id: string } }> };
        const testExecution = data.values.find((execution: { testCase: { id: string } }) =>
            execution.testCase.id === testCaseId
        );

        if (testExecution) {
            console.log('Test execution key:', testExecution.key);
            return testExecution.key;
        } else {
            console.log('Test execution not found for testCase ID:', testCaseId);
            return null;
        }
    }
    catch (error) {
        console.error('Error getting test execution:', error);
        return null;
    }
}

/**
 * Updates test execution steps in Zephyr
 * @param testExecutionKey - Test execution key
 * @param steps - Array of test steps to update
 * @throws Error if request fails
 */
export async function putTestExecution(testExecutionKey: string, steps: string[]) {
    try {
        const body = {
            steps: steps
        };

        await fetch(
            process.env.ZEPHYR_API_URL + 'testexecutions/' + testExecutionKey + '/teststeps',
            {
                method: 'PUT',
                body: JSON.stringify(body),
                headers: getHeaders()
            }
        );

        console.log('Successfully sent test steps to Zephyr ✅');
        console.log('------------------------------------------');

        console.log('Waiting 3 seconds before continuing... ⏳');
        await new Promise(resolve => setTimeout(resolve, 3000));
    }
    catch (error) {
        console.error('Error updating test steps:', error);
        throw error;
    }
}