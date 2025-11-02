/**
 * Zest Playwright Framework
 * 
 * Main entry point for the Zest Playwright test framework
 * 
 * @packageDocumentation
 */

// ============================================================================
// Configuration
// ============================================================================
export {
  defineZestConfig,
  getZestConfig,
  loadZestConfig,
  defaultConfig,
  type ZestConfig,
} from './config';

// ============================================================================
// Fixtures
// ============================================================================
export { test, expect } from './fixtures/fixtures';

// ============================================================================
// Reporter
// ============================================================================
export { default as CustomReporter } from './reporter/custom-reporter';

// ============================================================================
// Re-export common Playwright reporter types for convenience
// ============================================================================
export type {
  TestCase,
  TestResult,
  FullResult,
  Reporter,
} from '@playwright/test/reporter';

// ============================================================================
// Version
// ============================================================================
export const VERSION = '1.0.0';

