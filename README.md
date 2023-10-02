## Setup local development

### Install tools[MacOS]

- [Docker desktop](https://www.docker.com/products/docker-desktop)
- [DBeaver](https://dbeaver.com)
- [NodeJS](https://nodejs.org/)
- [Homebrew](https://brew.sh/)

  ```bash
   brew install node@18
  ```

- [Serverless](https://www.serverless.com/)
  ```bash
  npm install -g serverless
  ```

- [DB Docs](https://dbdocs.io/docs)

  ```bash
  npm install -g dbdocs
  dbdocs login
  ```

- [DBML CLI](https://www.dbml.org/cli/#installation)

  ```bash
  npm install -g @dbml/cli
  ```

### Setup infrastructure

- Start mariadb container & Create database:
  ```bash
  npm run create:mariadb
  ```

- Run db migration up:
  ```bash
  npm run typeorm:${stage} migration:up
  ```
- Run db migration down:
  ```bash
   npm run typeorm:${stage} migration:revert
  ```

### Documentation

- Generate DB documentation:

  ```bash
  npm run db_docs
  ```

- Access the DB documentation at [this address](https://dbdocs.io/parkkitae7/serverless_nest).

### How to generate code

- Generate schema SQL file with DBML:

  ```bash
  npm run db_schema
  ```

- Generate a new db migration:
  ```bash
  npm run migration:generate db/migrations/<migration_name>
  ```

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Serverless

```bash
# local
$ sls offline --stage <stage>

# deploy
$ sls deploy --stage <stage>
```