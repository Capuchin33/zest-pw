# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-02

### Added
- Initial release of Zest Playwright framework
- Automatic screenshot capture after each test step
- Custom test reporter with detailed step information
- JSON report generation with base64 encoded screenshots
- Zephyr Scale integration for test result synchronization
- Type-safe configuration system via `zest.config.ts`
- Custom fixtures with automatic screenshot support
- Test step tracking and enrichment
- Configurable screenshot behavior (always/on-failure/disabled)
- Configurable console output
- Support for test case key extraction from file names
- Environment variable support for sensitive configuration

### Features
- **Reporter System**
  - Customizable JSON report output
  - Console reporter with formatted output
  - Test results store for aggregating results
  - Result processor for transforming and enriching data

- **Screenshot System**
  - Automatic screenshot capture
  - Base64 encoding for JSON reports
  - Descriptive file naming based on step titles
  - Error screenshot capture on failures

- **Zephyr Integration**
  - Automatic test result updates
  - Test case ID resolution
  - Test execution key lookup
  - Test step updates with actual results

- **Configuration**
  - Type-safe configuration with TypeScript
  - Support for environment-specific configs
  - Default values for all options
  - Configuration validation

### Documentation
- Comprehensive README with quick start guide
- Detailed CONFIG.md with all options explained
- JSDoc comments for all public APIs
- Examples for common use cases

## [Unreleased]

### Planned
- Verbose logging mode implementation
- Video attachment support
- Parallel test execution optimization
- Custom step formatters
- Test retry configuration
- Advanced filtering options for reports

---

## Version History

- **1.0.0** - Initial stable release

