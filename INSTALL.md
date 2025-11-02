# Installation Guide

Complete guide for installing and setting up Zest Playwright in your project.

## Installation

### NPM

```bash
npm install --save-dev @zest-pw/playwright
```

### Yarn

```bash
yarn add --dev @zest-pw/playwright
```

### PNPM

```bash
pnpm add -D @zest-pw/playwright
```

## Prerequisites

Zest Playwright requires:
- **Node.js**: 16.x or higher
- **Playwright**: 1.40.0 or higher

If you don't have Playwright installed:

```bash
npm install --save-dev @playwright/test
npx playwright install
```

## Quick Setup

### 1. Create Configuration File

Create `zest.config.ts` in your project root:

```typescript
import { defineZestConfig } from '@zest-pw/playwright';

export default defineZestConfig({
  reporter: {
    saveJsonReport: true,
    printToConsole: true,
  },
  screenshots: {
    enabled: true,
    includeInReport: true,
  },
});
```

### 2. Configure Playwright

Update your `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  reporter: [
    ['list'],
    ['@zest-pw/playwright/reporter'], // Add Zest reporter
  ],
  // ... other Playwright config
});
```

### 3. Update Your Tests

```typescript
// Before
import { test, expect } from '@playwright/test';

// After
import { test, expect } from '@zest-pw/playwright';

test('My test', async ({ page }) => {
  await test.step('Navigate to page', async () => {
    await page.goto('https://example.com');
  });
  
  await test.step('Verify title', async () => {
    await expect(page).toHaveTitle(/Example/);
  });
});
```

### 4. Run Your Tests

```bash
npx playwright test
```

## Project Structure

After installation, your project should look like:

```
my-project/
├── node_modules/
│   └── @zest-pw/
│       └── playwright/          # Installed package
├── tests/
│   ├── TC-001.spec.ts
│   └── TC-002.spec.ts
├── test-results/
│   └── test-results.json        # Generated reports
├── zest.config.ts               # Zest configuration
├── playwright.config.ts         # Playwright configuration
└── package.json
```

## Configuration Examples

### Minimal Configuration

```typescript
import { defineZestConfig } from '@zest-pw/playwright';

export default defineZestConfig({
  reporter: {
    saveJsonReport: true,
  },
});
```

### Development Configuration

```typescript
import { defineZestConfig } from '@zest-pw/playwright';

export default defineZestConfig({
  reporter: {
    saveJsonReport: true,
    printToConsole: true,
    verbose: true,
  },
  screenshots: {
    enabled: true,
    includeInReport: true,
  },
});
```

### CI/CD Configuration

```typescript
import { defineZestConfig } from '@zest-pw/playwright';

const isCI = process.env.CI === 'true';

export default defineZestConfig({
  reporter: {
    saveJsonReport: true,
    printToConsole: !isCI,
  },
  screenshots: {
    enabled: true,
    onlyOnFailure: isCI,
  },
  zephyr: {
    enabled: isCI,
    updateResults: isCI,
  },
});
```

## Using with Zephyr Scale

### 1. Set Environment Variables

Create `.env` file:

```bash
ZEPHYR_API_URL=https://api.zephyrscale.smartbear.com/v2/
ZEPHYR_API_KEY=your-api-key-here
ZEPHYR_TEST_CYCLE_KEY=TEST-CYCLE-123
```

### 2. Configure Zest

```typescript
import { defineZestConfig } from '@zest-pw/playwright';

export default defineZestConfig({
  zephyr: {
    enabled: true,
    updateResults: true,
  },
});
```

### 3. Name Your Tests

Use test case keys in file names:

```
tests/
├── TC-001.spec.ts  ✅ Will sync with Zephyr
├── TC-002.spec.ts  ✅ Will sync with Zephyr
└── login.spec.ts   ⚠️  Won't sync automatically
```

## TypeScript Support

Zest Playwright is written in TypeScript and includes type definitions.

### Type Imports

```typescript
import { 
  defineZestConfig, 
  type ZestConfig 
} from '@zest-pw/playwright';

const config: ZestConfig = {
  reporter: {
    saveJsonReport: true,
  },
};

export default defineZestConfig(config);
```

### Using Types

```typescript
import type { TestInfo, Page } from '@zest-pw/playwright';

async function myHelper(page: Page, testInfo: TestInfo) {
  // Your helper code with full type safety
}
```

## Troubleshooting

### Module not found

**Error:**
```
Cannot find module '@zest-pw/playwright'
```

**Solution:**
```bash
# Reinstall
npm install --save-dev @zest-pw/playwright

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### TypeScript errors

**Error:**
```
Cannot find type definition for '@zest-pw/playwright'
```

**Solution:**
Ensure `@playwright/test` is installed as a peer dependency:

```bash
npm install --save-dev @playwright/test
```

### Configuration not loading

**Solution:**
1. Ensure `zest.config.ts` is in project root
2. Check file exports default config:
   ```typescript
   export default defineZestConfig({ ... });
   ```

### Screenshots not appearing

**Solution:**
Check configuration:

```typescript
screenshots: {
  enabled: true,
  includeInReport: true,
}
```

## Upgrading

### Check Current Version

```bash
npm list @zest-pw/playwright
```

### Update to Latest

```bash
npm update @zest-pw/playwright
```

### Update to Specific Version

```bash
npm install --save-dev @zest-pw/playwright@1.2.0
```

## Uninstalling

```bash
npm uninstall @zest-pw/playwright
```

Don't forget to:
1. Remove from `playwright.config.ts` reporters array
2. Update import statements in tests
3. Remove `zest.config.ts`

## Next Steps

- Read the [Configuration Guide](./CONFIG.md)
- Check [Examples](./README.md#examples)
- Join [Discussions](https://github.com/your-org/zest-playwright/discussions)

## Getting Help

- 📚 [Documentation](./README.md)
- 💬 [Discussions](https://github.com/your-org/zest-playwright/discussions)
- 🐛 [Report Issues](https://github.com/your-org/zest-playwright/issues)

