import * as fs from 'fs';

/**
 * Parses planned test steps from file
 * @param filePath - Path to test file
 * @param testTitle - Test title
 * @returns Array of planned step titles
 */
export function parsePlannedStepsFromFile(filePath: string, testTitle: string): string[] {
  const steps: string[] = [];
  
  try {
    if (!fs.existsSync(filePath)) {
      return steps;
    }

    const src = fs.readFileSync(filePath, 'utf8');
    const lines = src.split(/\r?\n/);
    
    let currentTestTitle: string | null = null;
    let insideTargetTest = false;
    let braceCount = 0;
    let testStartLine = -1;
    
    const testTitleRegex = /\btest(\.only|\.skip|\.fixme)?\s*\(\s*(["'`])([^"'`]+)\2\s*,/;
    const stepRegex = /\b(?:test|await\s+test)\.step\s*\(\s*(["'`])([^"'`]+)\1\s*,/;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      const testMatch = line.match(testTitleRegex);
      if (testMatch) {
        const foundTitle = testMatch[3];
        
        if (insideTargetTest && foundTitle !== testTitle) {
          insideTargetTest = false;
          braceCount = 0;
        }
        
        if (foundTitle === testTitle) {
          currentTestTitle = foundTitle;
          insideTargetTest = true;
          steps.length = 0;
          testStartLine = i;
          braceCount = 0;
          const openBraces = (line.match(/\{/g) || []).length;
          const closeBraces = (line.match(/\}/g) || []).length;
          braceCount += openBraces - closeBraces;
          continue;
        } else {
          currentTestTitle = foundTitle;
          continue;
        }
      }
      
      if (insideTargetTest && currentTestTitle === testTitle) {
        const openBraces = (line.match(/\{/g) || []).length;
        const closeBraces = (line.match(/\}/g) || []).length;
        braceCount += openBraces - closeBraces;
        
        if (braceCount <= 0 && i > testStartLine) {
          break;
        }
        
        const stepMatch = line.match(stepRegex);
        if (stepMatch) {
          steps.push(stepMatch[2]);
        }
      }
    }
  } catch (error) {
    console.error(`Error parsing file ${filePath}:`, error);
  }
  
  return steps;
}

