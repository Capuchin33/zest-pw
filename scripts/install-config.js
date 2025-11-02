#!/usr/bin/env node

/**
 * Post-install script to automatically create zest.config.ts in the project root
 * This script runs after npm install and creates a default configuration file
 * if it doesn't already exist.
 */

const fs = require('fs');
const path = require('path');

const configTemplate = `import { defineZestConfig } from '@zest-pw/test';

/**
 * Zest Playwright Configuration
 * 
 * Configure test reporting, screenshots, and Zephyr integration
 */
export default defineZestConfig({
  reporter: {
    // Save test results to JSON file
    saveJsonReport: true,
    // Output directory for reports
    outputDir: 'test-results',
    // Print test results to console
    printToConsole: true,
    // Verbose output (includes all step details)
    verbose: false,
  },
  screenshots: {
    // Enable screenshot capture
    enabled: true,
    // Include screenshots in JSON report
    includeInReport: true,
    // Capture screenshots only on failure
    onlyOnFailure: false,
  },
  zephyr: {
    // Enable Zephyr Scale integration
    enabled: false,
    // Update test results in Zephyr after test run
    updateResults: false,
    // API credentials (uses environment variables by default)
    // apiUrl: process.env.ZEPHYR_API_URL,
    // apiKey: process.env.ZEPHYR_API_KEY,
    // testCycleKey: process.env.ZEPHYR_TEST_CYCLE_KEY,
  },
});
`;

const configFileName = 'zest.config.ts';

// When postinstall runs, process.cwd() is the project root where npm install was executed
// This is the correct directory where we want to create zest.config.ts
const projectRoot = process.cwd();
const configPath = path.join(projectRoot, configFileName);

// Skip if we're in the zest-pw package development directory itself
// (when running npm install in the package repo)
const packageJsonPath = path.join(projectRoot, 'package.json');
if (fs.existsSync(packageJsonPath)) {
  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.name === '@zest-pw/test') {
      // We're in the package development directory, skip
      process.exit(0);
    }
  } catch (e) {
    // If we can't read package.json, continue anyway
  }
}

// Перевіряємо, чи файл вже існує
if (fs.existsSync(configPath)) {
  console.log(`[@zest-pw/test] ✓ ${configFileName} already exists, skipping...`);
  process.exit(0);
}

// Створюємо файл конфігурації
try {
  fs.writeFileSync(configPath, configTemplate, 'utf8');
  console.log(`[@zest-pw/test] ✓ Created ${configFileName} in project root`);
  console.log(`[@zest-pw/test]   Location: ${configPath}`);
} catch (error) {
  // Don't break the installation process, but show the error
  console.error(`[@zest-pw/test] ⚠ Failed to create ${configFileName}:`, error.message);
  console.error(`[@zest-pw/test]   Target directory: ${projectRoot}`);
  process.exit(0); // Exit with 0 to not break npm install
}

