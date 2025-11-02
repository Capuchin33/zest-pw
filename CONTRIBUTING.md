# Contributing to Zest Playwright

Thank you for your interest in contributing to Zest Playwright! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for everyone.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 7.x or higher
- Git
- TypeScript knowledge
- Playwright experience (recommended)

### Setup Development Environment

1. **Fork and Clone**
   ```bash
   git clone https://github.com/your-username/zest-playwright.git
   cd zest-playwright/zest-pw
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Build the Project**
   ```bash
   npm run build
   ```

4. **Link Locally** (for testing)
   ```bash
   npm link
   
   # In your test project
   cd /path/to/test-project
   npm link @zest-pw/playwright
   ```

## Development Workflow

### Branch Naming

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates

Example: `feature/add-video-support`

### Commit Messages

Follow conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

Examples:
```
feat(reporter): add verbose logging mode
fix(screenshots): handle missing directory gracefully
docs(readme): update installation instructions
```

## Making Changes

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes

- Write clear, readable code
- Follow existing code style
- Add TypeScript types
- Update documentation
- Add tests if applicable

### 3. Build and Test

```bash
# Build
npm run build

# Run tests
npm test

# Check TypeScript
npx tsc --noEmit
```

### 4. Commit Your Changes

```bash
git add .
git commit -m "feat: add awesome feature"
```

### 5. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### TypeScript

- Use TypeScript for all new code
- Prefer `interface` over `type` for object shapes
- Use explicit return types for functions
- Avoid `any` - use proper types

```typescript
// ✅ Good
export function processResults(data: TestData): ProcessedResults {
  // ...
}

// ❌ Bad
export function processResults(data: any): any {
  // ...
}
```

### Naming Conventions

- **Files**: kebab-case (`test-reporter.ts`)
- **Classes**: PascalCase (`CustomReporter`)
- **Functions**: camelCase (`processTestResults`)
- **Constants**: UPPER_SNAKE_CASE (`DEFAULT_TIMEOUT`)
- **Interfaces**: PascalCase with `I` prefix optional (`TestConfig` or `ITestConfig`)

### Comments

- Use JSDoc for public APIs
- Include `@param` and `@returns` tags
- Provide examples when helpful

```typescript
/**
 * Saves test results to JSON file
 * 
 * @param results - Test results object
 * @param outputDir - Output directory path
 * @returns Path to saved file
 * 
 * @example
 * ```typescript
 * const path = saveResults(results, './reports');
 * console.log(`Saved to: ${path}`);
 * ```
 */
export function saveResults(results: TestResults, outputDir: string): string {
  // ...
}
```

## Testing

### Running Tests

```bash
npm test
```

### Writing Tests

- Place test files next to the code they test
- Use `.spec.ts` or `.test.ts` extension
- Follow AAA pattern (Arrange, Act, Assert)

## Documentation

### README Updates

Update `README.md` when adding new features:
- Add feature to features list
- Update configuration examples
- Add usage examples

### CONFIG.md Updates

Update `CONFIG.md` when adding configuration options:
- Document the new option
- Provide default value
- Include examples

### CHANGELOG Updates

Add entry to `CHANGELOG.md`:

```markdown
## [Unreleased]

### Added
- New feature description

### Fixed
- Bug fix description
```

## Pull Request Process

### Before Submitting

- [ ] Code builds successfully
- [ ] Tests pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Commit messages follow convention
- [ ] Code follows style guide

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How was this tested?

## Screenshots (if applicable)

## Checklist
- [ ] Code builds without errors
- [ ] Tests pass
- [ ] Documentation updated
- [ ] CHANGELOG updated
```

### Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address review comments
4. Maintainer will merge when approved

## Reporting Issues

### Bug Reports

Include:
- Description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version, Playwright version)
- Code samples if applicable

### Feature Requests

Include:
- Description of the feature
- Use case
- Proposed implementation (if any)
- Examples

## Questions?

- Open a [Discussion](https://github.com/your-org/zest-playwright/discussions)
- Check existing [Issues](https://github.com/your-org/zest-playwright/issues)
- Read the [Documentation](./README.md)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

