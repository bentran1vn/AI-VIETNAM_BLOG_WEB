# AI-VIETNAM Blog Web

## Description

A comprehensive Node.js project template with essential configurations and best practices. This project provides a solid foundation for building Node.js applications with proper environment management, testing setup, and development tooling.

## Git Workflow and Conventions

### Branch Naming Convention

All branch names must follow this pattern: `type/description`

Available types:

- `feature/` - For new features
- `bugfix/` - For bug fixes
- `hotfix/` - For urgent fixes
- `release/` - For release preparation
- `dev/` - For development branches

Examples:

```bash
feature/user-authentication
bugfix/login-error
hotfix/security-patch
release/v1.0.0
dev/api-integration
```

### Commit Message Convention

All commit messages must follow the conventional commit format:

```
type(scope): subject
```

#### Types

- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, etc)
- `refactor` - Code changes that neither fix bugs nor add features
- `perf` - Performance improvements
- `test` - Adding or modifying tests
- `chore` - Changes to the build process or auxiliary tools
- `ci` - Changes to CI configuration files and scripts
- `revert` - Reverting changes

#### Rules

- Type must be lowercase
- Type is required
- Scope is required
- Subject is required
- No period at the end of the subject
- Maximum header length is 72 characters

Examples:

```bash
feat(auth): implement user login functionality
fix(api): resolve user data fetching error
docs(readme): update installation instructions
style(ui): format login form components
refactor(database): optimize query performance
```

### Workflow

1. Create a new branch following the branch naming convention
2. Make your changes
3. Commit your changes following the commit message convention
4. Push your changes
5. Create a pull request

The system will automatically:

- Check your commit messages when you commit
- Verify branch names when you push
- Reject commits/pushes that don't follow the conventions

## Features

- Structured project organization
- Environment variable management (.env support)
- Comprehensive logging configuration
- Testing infrastructure setup
- IDE/Editor configurations
- Production build optimization
- Development and debugging tools

## Installation
