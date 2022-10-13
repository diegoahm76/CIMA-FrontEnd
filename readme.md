# Basic commands

### Initializing project

```bash
# Installing NPM packages
yarn [install]
```

### Yarn packages management

```bash
# Install a NPM package
yarn add [--dev] <package>[@<version>]

# Outdated packages list
yarn outdated

# Upgrade a NPM package
yarn upgrade <package>@latest
yarn upgrade <package>@<specific_version>

# Remove a NPM package
yarn remove <package>
```

### Development server

```bash
ng serve --port 4201
yarn start
```

### Build

```bash
# For test environment
ng build -c=test --vendor-chunk --output-path=../frontend-deploys/test
yarn build:test

# For production environment
ng build -c production --vendor-chunk --output-path=../frontend-deploys/production
yarn build:production
```

### Running unit tests

```bash

```

### Running end-to-end tests

```bash

```
