# Publishing Guide

This guide explains how to publish the Zest Playwright package to npm.

## Prerequisites

1. **NPM Account**
   - Create an account at [npmjs.com](https://www.npmjs.com/)
   - Verify your email address

2. **Two-Factor Authentication** (recommended)
   - Enable 2FA on your npm account
   - Use an authenticator app

3. **NPM Access Token** (for CI/CD)
   - Generate a token at [npmjs.com/settings/tokens](https://www.npmjs.com/settings/~/tokens)
   - Choose "Automation" type for CI/CD

## Local Publishing

### 1. Prepare the Package

```bash
# Navigate to the package directory
cd zest-pw

# Install dependencies
npm install

# Build the package
npm run build

# Verify the build
ls -la dist/
```

### 2. Test Locally

```bash
# Pack the package (creates a .tgz file)
npm pack

# Test in another project
cd /path/to/test-project
npm install /path/to/zest-pw/zest-pw-playwright-1.0.0.tgz
```

### 3. Publish to NPM

```bash
# Login to npm (first time only)
npm login

# Dry run to see what will be published
npm publish --dry-run

# Publish the package
npm publish --access public
```

## Publishing via GitHub Actions

### 1. Setup GitHub Secrets

Add your NPM token to GitHub repository secrets:

1. Go to your repository settings
2. Navigate to "Secrets and variables" → "Actions"
3. Add a new secret named `NPM_TOKEN`
4. Paste your npm access token

### 2. Create a Release

```bash
# Tag the release
git tag v1.0.0
git push origin v1.0.0

# Or create a release through GitHub UI
# Go to Releases → Create new release
```

### 3. Automatic Publishing

The GitHub Action will automatically:
- Build the package
- Run tests
- Publish to npm

## Version Management

### Update Version

```bash
# Patch version (1.0.0 → 1.0.1)
npm version patch

# Minor version (1.0.0 → 1.1.0)
npm version minor

# Major version (1.0.0 → 2.0.0)
npm version major
```

This will:
- Update `package.json` version
- Create a git tag
- Run `npm run build` (via version script)

### Push Changes

```bash
# Push commits and tags
git push && git push --tags
```

## Pre-publish Checklist

- [ ] All tests pass (`npm test`)
- [ ] TypeScript compiles without errors (`npm run build`)
- [ ] README.md is up to date
- [ ] CHANGELOG.md is updated with new version
- [ ] Version number follows semver
- [ ] Dependencies are correct in package.json
- [ ] .npmignore excludes source files
- [ ] LICENSE file is present

## Post-publish Steps

1. **Verify on NPM**
   ```bash
   npm view @zest-pw/playwright
   ```

2. **Test Installation**
   ```bash
   npm install @zest-pw/playwright
   ```

3. **Update Documentation**
   - Update README with installation instructions
   - Create GitHub release notes
   - Announce on social media/forums

## Troubleshooting

### "You do not have permission to publish"

**Solution:** Use scoped package name or request access to the package name.

```bash
# Use scoped name
npm publish --access public
```

### "ENEEDAUTH"

**Solution:** Login to npm again.

```bash
npm logout
npm login
```

### "Package name too similar to existing package"

**Solution:** Choose a more unique name or use a scope.

```json
{
  "name": "@your-org/zest-playwright"
}
```

### Build fails

**Solution:** Check TypeScript errors.

```bash
npm run build
# Fix any TypeScript errors
```

## Package Scope

This package uses the scope `@zest-pw/`. To change it:

1. Update `package.json`:
   ```json
   {
     "name": "@your-org/playwright"
   }
   ```

2. Update imports in examples:
   ```typescript
   import { test } from '@your-org/playwright';
   ```

## Beta/Alpha Releases

### Publish Beta Version

```bash
# Set version to beta
npm version 1.1.0-beta.0

# Publish with beta tag
npm publish --tag beta
```

### Install Beta Version

```bash
npm install @zest-pw/playwright@beta
```

## Unpublishing (Use with Caution)

```bash
# Unpublish specific version (within 72 hours)
npm unpublish @zest-pw/playwright@1.0.0

# Deprecate instead (recommended)
npm deprecate @zest-pw/playwright@1.0.0 "Use version 1.0.1 instead"
```

## Resources

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Semantic Versioning](https://semver.org/)
- [NPM Scoped Packages](https://docs.npmjs.com/cli/v7/using-npm/scope)

